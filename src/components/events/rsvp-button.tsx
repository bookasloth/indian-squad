"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { post } from "@/lib/checkout";

export function RsvpButton({ eventId, joined, organiser }: { eventId: string; joined: boolean; organiser: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      await post("/api/events/rsvp", { eventId, join: !joined });
      router.refresh();
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
          <Button variant="outline" onClick={toggle} loading={busy}>
            Cancel my registration
          </Button>
        </>
      ) : (
        <>
          <Button variant="brand" size="lg" onClick={toggle} loading={busy}>
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
