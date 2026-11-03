// OWNER: P3
"use client";
import { useState } from "react";
import { Directory } from "@/components/fundraisers/Directory";
import { listCauses, patchMerchant } from "@/components/merchant/api";
import { CauseCard } from "@/components/merchant/CauseCard";
import { useMerchant } from "@/components/merchant/MerchantShell";
import { Async, Empty, ErrorBox } from "@/components/merchant/States";
import { useAsync } from "@/components/merchant/useAsync";

export default function CausePage() {
  const { merchant, refreshMerchant } = useMerchant();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { state, reload } = useAsync(() => listCauses(), []);

  async function choose(causeId: string) {
    setBusy(true);
    setError(null);
    try {
      await patchMerchant(merchant.id, { activeCauseId: causeId });
      refreshMerchant();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save your choice");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">Choose a fundraiser to support with your sales. Selecting a new one replaces your current partnership.</p>

      {error && <ErrorBox message={error} />}

      <Async state={state} onRetry={reload}>
        {(causes) =>
          causes.length === 0 ? (
            <Empty title="No active causes found">
              Check back soon, or register a new fundraiser from the navigation above.
            </Empty>
          ) : (
            <Directory causes={causes}>{(c) => (
                <CauseCard
                  key={c.id}
                  cause={c}
                  selected={merchant.activeCauseId === c.id}
                  busy={busy}
                  onSelect={() => choose(c.id)}
                />
              )}</Directory>
          )
        }
      </Async>
    </div>
  );
}
