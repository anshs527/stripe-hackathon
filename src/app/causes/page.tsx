// OWNER: P4
"use client";
import Link from "next/link";
import { Directory } from "@/components/fundraisers/Directory";
import { api } from "@/components/customer/api";
import { CauseCard } from "@/components/customer/CauseCard";
import { useAsync } from "@/components/customer/hooks";
import { EmptyState, ErrorNotice, LinkButton, Spinner } from "@/components/customer/ui";

export default function CausesPage() {
  const { data, error, loading, reload } = useAsync(() => api.listCauses({ status: "ACTIVE" }), []);

  return (
    <main className="discovery-page">
      <div className="page-heading"><div><h1>Causes around the corner</h1><p>Find a local fundraiser. Make everyday purchases mean a little more.</p></div><Link href="/merchant" className="button-primary">Support as a business <span aria-hidden="true">↗</span></Link></div>
      <div className="discovery-intro"><div><h2>A little from each sale.<br />A lot for your community.</h2><p>Partner with a cause through customer round-ups or a percentage of your sales.</p><Link href="/merchant" className="text-link">Set up your giving →</Link></div><img src="/images/community.svg" alt="" /></div>
      {loading && !data && <Spinner />}
      {!data && error && <ErrorNotice message={error} onRetry={reload} />}
      {data && data.length === 0 && (
        <EmptyState title="No active causes yet">
          <LinkButton href="/causes/new">Register a cause</LinkButton>
        </EmptyState>
      )}
      {data && data.length > 0 && (
        <Directory causes={data}>{c => <li key={c.id}><CauseCard cause={c} /></li>}</Directory>
      )}
      <p className="mt-6 text-sm">
        <Link href="/causes/new" className="text-indigo-600 underline">
          Register your cause
        </Link>
      </p>
    </main>
  );
}
