"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  return <header className="site-header">
    <Link className="brand" href="/"><span aria-hidden="true" className="brand-mark">↗</span>Fundraisers</Link>
    <nav aria-label="Main navigation">
      <Link href="/causes" aria-current={pathname === "/" || pathname === "/causes" ? "page" : undefined}>Discover</Link>
      <Link href="/merchant" aria-current={pathname.startsWith("/merchant") ? "page" : undefined}>For businesses</Link>
      <Link href="/causes/new" aria-current={pathname === "/causes/new" ? "page" : undefined} className="header-action">Start a fundraiser</Link>
    </nav>
    <span className="test-label">Test mode</span>
  </header>;
}
