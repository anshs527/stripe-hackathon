// OWNER: P4
"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { api } from "@/components/customer/api";
import CauseProgressPanel from "@/components/customer/CauseProgressPanel";
import { useAsync } from "@/components/customer/hooks";
import { ErrorNotice, Page, Spinner } from "@/components/customer/ui";

export default function CauseDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: cause, error, loading, reload } = useAsync(() => api.getCause(slug), [slug]);

  if (loading && !cause) return <Page><Spinner /></Page>;
  if (!cause) {
    return (
      <Page>
        <ErrorNotice message={error ?? "Cause not found."} onRetry={reload} />
        <p className="mt-4 text-sm"><Link href="/causes" className="underline">All causes</Link></p>
      </Page>
    );
  }

  return (
    <Page>
      <Link href="/causes" className="text-link">← All fundraisers</Link>
      <div className="detail-cover"><img src="/images/community.svg" alt="" /></div>
      <h1 className="mb-6 text-3xl font-bold">{cause.title}</h1>
      <p className="-mt-4 mb-4 text-sm text-slate-500">
        {cause.city} · Organized by {cause.ownerName}
      </p>
      {cause.status === "CLOSED" && (
        <p className="mb-4 rounded-lg bg-slate-100 p-3 text-sm text-slate-700">This cause is closed to new donations.</p>
      )}
      {cause.status === "DRAFT" && (
        <p className="mb-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">This cause is not yet accepting donations.</p>
      )}
      <p className="mb-6 whitespace-pre-line text-slate-800">{cause.description}</p>
      <CauseProgressPanel slug={cause.slug} />
      {cause.status === "ACTIVE" && <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 pt-6"><p className="text-sm text-slate-600">Give through your business’s everyday sales.</p><Link href="/merchant/cause" className="button-primary">Support as a business →</Link></div>}
    </Page>
  );
}
