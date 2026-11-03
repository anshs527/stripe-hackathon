import "./globals.css";
import { SiteHeader } from "@/components/fundraisers/SiteHeader";
export const metadata = { title: "Fundraisers · Local giving", description: "Connect local businesses with causes in their community." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><a href="#content" className="skip-link">Skip to content</a><SiteHeader /><div id="content">{children}</div></body></html>;
}
