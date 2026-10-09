"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { post } from "@/lib/checkout";

export function RsvpButton({ eventId, joined, organiser }: { eventId: string; joined: boolean; organiser: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const [error, setError] = useState<string | null>(null);
  // Pending until the refreshed page brings the new `joined` — otherwise the old
  // button re-enables mid-refresh and a second click undoes the first.
  const loading = busy || refreshing;

  async function toggle() {
    if (loading) return;
    setBusy(true);
    setError(null);
    try {
      await post("/api/events/rsvp", { eventId, join: !joined });
      startRefresh(() => router.refresh());
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {joined ? (
        <>
          <Alert variant="success">
            <AlertDescription>You&rsquo;re registered. {organiser} will contact you with details.</AlertDescription>
          </Alert>
          <Button variant="outline" onClick={toggle} loading={loading}>
            Cancel my registration
          </Button>
        </>
      ) : (
        <>
          <Button variant="brand" size="lg" onClick={toggle} loading={loading}>
            Register — free
          </Button>
          <p className="text-xs text-muted-foreground">We&rsquo;ll share your name and email with {organiser}.</p>
        </>
      )}
      {error && (
        <Alert variant="danger">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
