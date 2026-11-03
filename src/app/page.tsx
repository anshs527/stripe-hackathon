// OWNER: P1
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f5f4ef] text-slate-900">
      <div className="mx-auto max-w-6xl px-6 py-8 sm:px-10">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-900/15 pb-6">
          <span className="font-semibold tracking-tight">Stripe Social Impact</span>
          <span className="rounded-full border border-emerald-800/20 px-3 py-1 text-xs font-medium text-emerald-800">Test-mode demo · No real money</span>
        </header>
        <section className="grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr] lg:py-24">
          <div>
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">Small purchases. Local change.</p>
            <h1 className="max-w-2xl text-5xl font-semibold leading-[1.08] tracking-tight sm:text-6xl">Make everyday spending do a little more.</h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-600">Round up at checkout or give a share of sales. Local shops support local causes, with contributions routed through Stripe Connect.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop/demo-roundup" className="rounded-full bg-emerald-900 px-6 py-3 font-medium text-white hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-4">Try a round-up purchase →</Link>
              <Link href="/merchant?merchantId=demo-roundup" className="rounded-full border border-slate-300 px-6 py-3 font-medium hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4">Merchant dashboard</Link>
            </div>
          </div>
          <div className="self-center rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-900/5">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">An example of a little more</p>
            <div className="my-8 space-y-4 text-lg">
              <div className="flex justify-between"><span>Your purchase</span><span>$4.35</span></div>
              <div className="flex justify-between text-emerald-800"><span>Your round-up</span><span>+$0.65</span></div>
              <div className="flex justify-between border-t border-slate-200 pt-4 font-semibold"><span>Total</span><span>$5.00</span></div>
            </div>
            <p className="rounded-xl bg-emerald-50 p-4 leading-relaxed text-emerald-950">The shop keeps its $4.35 share. The cause receives $0.65 when the platform donation fee is zero.</p>
            <p className="mt-4 text-xs text-slate-500">Illustrative split. The platform absorbs payment processing fees.</p>
          </div>
        </section>
        <section aria-label="Explore the demo" className="grid gap-4 border-t border-slate-900/15 py-8 sm:grid-cols-3">
          {[
            { number: '01', title: 'Choose a local cause', description: 'Meet the projects your neighborhood can help bring to life.', href: '/causes' },
            { number: '02', title: 'Give from your sales', description: 'Try merchant-funded giving with no extra charge to the customer.', href: '/shop/demo-percent' },
            { number: '03', title: 'See the impact', description: 'Follow completed contributions in the merchant impact dashboard.', href: '/merchant/impact?merchantId=demo-roundup' },
          ].map(item => <Link key={item.number} href={item.href} className="rounded-2xl p-5 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4"><span className="text-sm text-emerald-800">{item.number}</span><h2 className="mt-3 text-lg font-semibold">{item.title} →</h2><p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p></Link>)}
        </section>
        <footer className="pb-6 text-xs text-slate-500">Hackathon demonstration. Historical seed contributions are sample data.</footer>
      </div>
    </main>
  );
}
