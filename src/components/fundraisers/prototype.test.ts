import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createContext, runInContext } from 'node:vm';
import { describe, expect, it } from 'vitest';

function frontend(kind: 'business' | 'organization', storage = new Map<string, string>()) {
  const elements = new Map<string, { innerHTML: string; scrollTop: number }>();
  const handlers: Record<string, ((event: unknown) => void)[]> = {};
  const timers: (() => void)[] = [];
  const document = {
    getElementById(id: string) {
      if (!elements.has(id)) elements.set(id, { innerHTML: '', scrollTop: 0 });
      return elements.get(id);
    },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: () => ({ setAttribute() {}, remove() {} }),
    body: { appendChild() {} },
    addEventListener(name: string, handler: (event: unknown) => void) {
      (handlers[name] ??= []).push(handler);
    },
  };
  const context = createContext({
    document, console, location: { hash: '' }, scrollTo() {}, addEventListener() {},
    setTimeout(callback: () => void) { timers.push(callback); },
    localStorage: { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) },
  });
  for (const name of ['shared', kind]) runInContext(readFileSync(resolve(`public/fundraisers/${name}.js`), 'utf8'), context);
  const run = (code: string) => runInContext(code, context);
  const data = (code: string) => JSON.parse(run(`JSON.stringify(${code})`));
  function click(action: string, id = '') {
    const target = { dataset: { act: action, id }, closest: (selector: string) => selector === '[data-act]' ? target : null };
    handlers.click.forEach(handler => handler({ target }));
  }
  function flush() { while (timers.length) timers.shift()!(); }
  return { run, data, click, flush, storage };
}

describe('prototype-matched Fundraisers flows', () => {
  it('publishes, requests, accepts, activates, and reports contributions across views', () => {
    const org = frontend('organization');
    org.run("location.hash='#/new';ui.form=blank();Object.assign(ui.form,EXAMPLE);ui.form.amts=EXAMPLE.amts.map(a=>[...a])");
    expect(org.data('validate()')).toEqual({});
    org.click('publish'); org.flush();
    const cause = org.data("DB.fundraisers.find(f=>f.camp==='Spring Garden Boxes')");
    expect(cause.status).toBe('LIVE');
    org.run(`openRequest('boneyard',${JSON.stringify(cause.id)})`);
    org.click('sendreq'); org.flush();
    const request = org.data(`DB.requests.find(r=>r.cause===${JSON.stringify(cause.id)})`);
    expect(request.status).toBe('Pending');

    const business = frontend('business', org.storage);
    business.click('accept', request.id);
    expect(business.data('formError()')).toBeNull();
    business.click('activate'); business.flush();
    const partnership = business.data(`DB.partnerships.find(p=>p.cause===${JSON.stringify(cause.id)})`);
    expect(partnership.status).toBe('Scheduled');
    expect(business.data(`DB.requests.find(r=>r.id===${JSON.stringify(request.id)}).status`)).toBe('Accepted');
    business.run('simulateDay()');
    org.run('loadDB()');
    const contributions = org.data(`contribRows(F(${JSON.stringify(cause.id)}))`);
    expect(contributions).toHaveLength(1);
    expect(contributions[0].amt).toBeGreaterThan(0);
    expect(org.run('contributions()')).toContain('Boneyard Coffee');
  });

  it('pauses, resumes, caps, and ends a partnership without losing its contributions', () => {
    const app = frontend('business');
    app.run("DB.partnerships=[{id:'test',cause:'pantry',rule:'PERCENTAGE',pct:10,dur:'ongoing',start:DB.today,end:null,cap:200,status:'Active',donated:0}]");
    app.click('pause', 'test'); app.run('simulateDay()');
    expect(app.data('DB.partnerships[0].donated')).toBe(0);
    app.click('pause', 'test'); app.run('simulateDay();simulateDay()');
    expect(app.data('DB.partnerships[0].donated')).toBe(200);
    expect(app.data('DB.partnerships[0].status')).toBe('Completed');
    app.click('end', 'test'); app.run('simulateDay()');
    expect(app.data('DB.partnerships[0].donated')).toBe(200);
  });

  it('combines discovery filters and escapes user-written fundraiser text', () => {
    const app = frontend('business');
    app.run("ui.f={distance:1,cat:'Education',type:'Student org'};ui.q='textbook'");
    expect(app.data('filtered().map(f=>f.id)')).toEqual(['scholars']);
    app.run("ui.q='unmatched'");
    expect(app.data('filtered()')).toEqual([]);
    expect(app.run("esc('<img src=x onerror=alert(1)>')")).toBe('&lt;img src=x onerror=alert(1)&gt;');
  });

  it('validates publishing and partnership dates, and stops giving to closed fundraisers', () => {
    const org = frontend('organization');
    org.run('ui.form=blank()');
    expect(Object.keys(org.data('validate()'))).toEqual(expect.arrayContaining(['camp', 'blurb', 'goal', 'ends']));
    org.run("Object.assign(ui.form,EXAMPLE);ui.form.goal='Infinity'");
    expect(org.data('validate()').goal).toBeTruthy();
    const app = frontend('business');
    app.run("newForm('pantry');ui.form.end=''");
    expect(app.data('formError()').k).toBe('end');
    app.run("newForm('pantry');ui.form.cap='Infinity'");
    expect(app.data('formError()').k).toBe('cap');
    app.run("F('bike').status='CLOSED';simulateDay()");
    expect(app.data("DB.partnerships.find(p=>p.cause==='bike').status")).toBe('Completed');
  });

  it('preserves requested date ranges and supports draft editing and withdrawal', () => {
    const org = frontend('organization');
    org.run("location.hash='#/new';ui.form=blank();Object.assign(ui.form,EXAMPLE)");
    org.click('draft');
    const cause = org.data("DB.fundraisers.find(f=>f.camp===EXAMPLE.camp)");
    expect(cause.status).toBe('DRAFT');
    org.run(`location.hash=${JSON.stringify("#/edit/"+cause.id)};ui.form=fromFundraiser(F(${JSON.stringify(cause.id)}))`);
    org.click('publish'); org.flush();
    org.run(`openRequest('boneyard',${JSON.stringify(cause.id)});ui.req.dur='range';ui.req.end='2026-11-18'`);
    org.click('sendreq'); org.flush();
    const request = org.data(`DB.requests.find(r=>r.cause===${JSON.stringify(cause.id)})`);
    expect(request.end).toBe('2026-11-18');
    const business = frontend('business', org.storage);
    business.click('accept', request.id);
    expect(business.data('ui.form.end')).toBe(request.end);
    org.click('withdraw', request.id);
    expect(org.data(`DB.requests.some(r=>r.id===${JSON.stringify(request.id)})`)).toBe(false);
  });

  it('renders every primary view and keeps public links inside the new frontend', () => {
    const business = frontend('business');
    for (const route of ['discover', 'partnerships', 'requests', 'f/pantry', 'f/pantry/support', 'p/p_bike', 'public/pantry']) {
      business.run(`location.hash=${JSON.stringify('#/'+route)};render()`);
      expect(business.run("document.getElementById('app').innerHTML.length")).toBeGreaterThan(100);
    }
    const org = frontend('organization');
    for (const route of ['fundraisers', 'new', 'edit/pantry', 'f/pantry', 'businesses', 'requests', 'contributions', 'public/pantry']) {
      org.run(`location.hash=${JSON.stringify('#/'+route)};rerender()`);
      expect(org.run("document.getElementById('app').innerHTML.length")).toBeGreaterThan(100);
    }
    expect(org.run("publicPage(F('pantry'))")).toContain('/business#/f/pantry');
  });
});
