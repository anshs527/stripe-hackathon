"use client";
import Link from "next/link";
import { getConnectStatus, listCauses } from "@/components/merchant/api";
import { useMerchant } from "@/components/merchant/MerchantShell";
import { StatusBanner } from "@/components/merchant/StatusBanner";
import { Async } from "@/components/merchant/States";
import { useAsync } from "@/components/merchant/useAsync";
import { CauseCard } from "@/components/merchant/CauseCard";

export default function MerchantOverview() {
  const { merchant } = useMerchant();
  const { state, reload } = useAsync(() => getConnectStatus(merchant.id), [merchant.id]);
  const causes = useAsync(() => listCauses(), []);
  const query = `?merchantId=${encodeURIComponent(merchant.id)}`;

  return <div className="space-y-6">
    <Async state={state} onRetry={reload}>
      {status => <StatusBanner merchantId={merchant.id} status={status} />}
    </Async>
    <div className="partnership-layout">
      <section>
        <h2 className="section-title">Your supported fundraiser</h2>
        <Async state={causes.state} onRetry={causes.reload}>{list => {
          const cause = list.find(c => c.id === merchant.activeCauseId);
          return cause ? <ul><CauseCard cause={cause} selected busy={false} onSelect={() => {}} /></ul> :
            <div className="directory-empty"><h3>{merchant.activeCauseId ? "Your fundraiser is no longer active" : "Start your first partnership"}</h3><p>Choose an active local fundraiser to receive donations from your sales.</p><Link href={`/merchant/cause${query}`} className="button-primary">Discover fundraisers</Link></div>;
        }}</Async>
      </section>
      <section className="giving-summary">
        <h2 className="section-title">How you give</h2>
        <p className="giving-value">{merchant.ruleType === "ROUND_UP" ? "Customer round-ups" : `${(merchant.percentageBps / 100).toFixed(2)}% of every sale`}</p>
        <p>{merchant.ruleType === "ROUND_UP" ? "Customers can round their purchase up to the next dollar at checkout." : "Your contribution comes out of each sale. Customers pay the original price."}</p>
        <Link href={`/merchant/rules${query}`} className="text-link">Edit giving settings →</Link>
        <hr />
        <h2 className="section-title">See the difference</h2>
        <p>Track settled contributions and share your business’s impact.</p>
        <Link href={`/merchant/impact${query}`} className="text-link">View your impact →</Link>
        <hr />
        <Link href={`/merchant/cause${query}`} className="text-link">Change supported fundraiser →</Link>
      </section>
    </div>
  </div>;
}
