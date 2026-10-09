"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OUTCOME_TEXT, payZoho, post } from "@/lib/checkout";
import { site } from "@/lib/site";

type Message = { tone: "info" | "danger" | "success"; text: string };

export function EventPayButton({
  eventId,
  priceLabel,
  name,
  email,
}: {
  eventId: string;
  priceLabel: string;
  name?: string;
  email: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [refreshing, startRefresh] = useTransition();
  const [message, setMessage] = useState<Message | null>(null);

  async function buy() {
    if (busy || refreshing) return;
    setBusy(true);
    setMessage(null);
    try {
      const { orderId } = await post("/api/events/order", { eventId });
      const outcome = await payZoho(orderId, site.name, { name, email });
      if (outcome === "paid") {
        setMessage({ tone: "success", text: `You're in! Your ticket is on its way to ${email}.` });
        startRefresh(() => router.refresh());
      } else {
        setMessage(OUTCOME_TEXT[outcome]);
      }
    } catch (e) {
      setMessage({ tone: "danger", text: (e as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Button variant="brand" size="lg" loading={busy || refreshing} onClick={buy}>
        Buy ticket · {priceLabel}
      </Button>
      {message && (
        <Alert variant={message.tone}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
