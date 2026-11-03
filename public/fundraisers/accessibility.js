// Keep keyboard focus inside drawers, including when their contents are refreshed.
(() => {
  let dialog = null;
  let opener = null;
  let focusedField = null;
  const controls = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]';
  const fieldSelector = element => {
    if (element.id) return `#${CSS.escape(element.id)}`;
    for (const name of ['data-in', 'data-rqi', 'data-rq', 'data-fld', 'data-act']) {
      if (element.hasAttribute(name)) {
        let selector = `[${name}="${CSS.escape(element.getAttribute(name))}"]`;
        if (element.type === 'radio') selector += `[value="${CSS.escape(element.value)}"]`;
        return selector;
      }
    }
    return null;
  };
  document.addEventListener('click', event => {
    const target = event.target.closest('button,a,[data-act]');
    if (!dialog && target) opener = target;
  }, true);
  document.addEventListener('focusin', event => {
    if (dialog?.contains(event.target)) focusedField = fieldSelector(event.target);
  });
  function sync() {
    const next = document.querySelector('[role="dialog"]');
    document.querySelectorAll('.shell,.demobar').forEach(element => { element.inert = !!next; });
    document.body.classList.toggle('drawer-open', !!next);
    document.querySelectorAll('.err').forEach(element => element.setAttribute('role', 'alert'));
    document.querySelectorAll('.input input,.input select').forEach(element => {
      const label = element.closest('.input').previousElementSibling;
      if (!element.id && !element.hasAttribute('aria-label') && label?.matches('label')) element.setAttribute('aria-label', label.textContent);
    });
    if (next !== dialog) {
      const previous = dialog;
      dialog = next;
      if (next) {
        const field = previous && focusedField ? next.querySelector(focusedField) : null;
        (field || next.querySelector(controls))?.focus({ preventScroll: true });
      } else if (previous) {
        focusedField = null;
        if (opener?.isConnected) opener.focus({ preventScroll: true });
        else document.getElementById('app').focus({ preventScroll: true });
      }
    }
    document.querySelectorAll('table').forEach(table => {
      if (table.parentElement.classList.contains('table-scroll')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', 'Scrollable table');
      table.before(wrapper);
      wrapper.append(table);
    });
  }
  document.addEventListener('keydown', event => {
    if (!dialog || event.key !== 'Tab') return;
    const items = [...dialog.querySelectorAll(controls)].filter(element => element.getClientRects().length);
    const first = items[0], last = items.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  });
  new MutationObserver(sync).observe(document.getElementById('app'), { childList: true, subtree: true });
  sync();
})();
