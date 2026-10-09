"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { post } from "@/lib/checkout";

type Action = "approve_partner" | "reject_partner" | "approve_event" | "reject_event";

export function ReviewActions({ id, kind }: { id: string; kind: "partner" | "event" }) {
  const router = useRouter();
  const [busy, setBusy] = useState<Action | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function act(action: Action) {
    if (busy) return;
    setBusy(action);
    setError(null);
    try {
      await post("/api/admin/partners", { action, id });
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="sm" variant="brand" loading={busy === `approve_${kind}`} disabled={!!busy} onClick={() => act(`approve_${kind}`)}>
        Approve
      </Button>
      <Button size="sm" variant="outline" loading={busy === `reject_${kind}`} disabled={!!busy} onClick={() => act(`reject_${kind}`)}>
        Reject
      </Button>
      {error && <span className="text-sm text-danger">{error}</span>}
    </div>
  );
}
