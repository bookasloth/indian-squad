"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import type { OpenReport } from "@/lib/community-data";

export function ModerationList({ reports: initial }: { reports: OpenReport[] }) {
  const [reports, setReports] = useState(initial);
  const [error, setError] = useState<string | null>(null);

  async function act(action: "remove" | "dismiss", report: OpenReport) {
    setError(null);
    const body =
      action === "remove" ? { action, postId: report.postId } : { action, reportId: report.id };
    // Optimistic: drop every open report for this post (remove) or just this one.
    setReports((cur) =>
      cur.filter((r) => (action === "remove" ? r.postId !== report.postId : r.id !== report.id)),
    );
    try {
      const res = await fetch("/api/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
    } catch {
      setReports(initial);
      setError("Action failed.");
    }
  }

  if (reports.length === 0) {
    return <p className="text-muted-foreground">No open reports. All clear.</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      {error && <p className="text-sm text-danger">{error}</p>}
      <ul className="flex flex-col divide-y divide-border">
        {reports.map((r) => (
          <li key={r.id} className="flex flex-col gap-3 py-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                Reported by @{r.reporterUsername ?? "unknown"} · post by @
                {r.authorUsername ?? "unknown"}
              </span>
              <span>{timeAgo(r.createdAt)}</span>
            </div>
            <p className="whitespace-pre-wrap break-words rounded-input border border-border bg-muted p-3 text-sm">
              {r.postBody}
            </p>
            {r.reason && <p className="text-sm text-muted-foreground">Reason: {r.reason}</p>}
            <div className="flex gap-2">
              <Button variant="destructive" size="sm" onClick={() => act("remove", r)}>
                Remove post
              </Button>
              <Button variant="outline" size="sm" onClick={() => act("dismiss", r)}>
                Dismiss
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
