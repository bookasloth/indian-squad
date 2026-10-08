"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { post } from "@/lib/checkout";
import { SPORTS } from "@/lib/site";

const SELECT =
  "flex h-10 w-full rounded-input border border-input bg-background px-3 py-2 text-sm text-foreground transition-ui focus-visible:border-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function PartnerEventForm({ defaultCity }: { defaultCity: string }) {
  const router = useRouter();
  const [ticketing, setTicketing] = useState<"rsvp" | "external">("rsvp");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "danger"; text: string } | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    setBusy(true);
    setMessage(null);
    try {
      await post("/api/partners/events", Object.fromEntries(f.entries()));
      form.reset();
      setTicketing("rsvp");
      setMessage({ tone: "success", text: "Submitted! We'll review it, usually within a day, and email you when it's live." });
      router.refresh();
    } catch (err) {
      setMessage({ tone: "danger", text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Event title</Label>
        <Input id="title" name="title" required maxLength={120} placeholder="e.g. Diwali Box Cricket Cup" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="sport">Sport</Label>
          <select id="sport" name="sport" defaultValue="cricket" className={SELECT}>
            {SPORTS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="capacity">Capacity (optional)</Label>
          <Input id="capacity" name="capacity" type="number" min={1} placeholder="e.g. 60" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="venue">Venue</Label>
          <Input id="venue" name="venue" required maxLength={120} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="city">City</Label>
          <Input id="city" name="city" required maxLength={60} defaultValue={defaultCity} />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="starts_at">Starts (India time)</Label>
          <Input id="starts_at" name="starts_at" type="datetime-local" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ends_at">Ends (optional)</Label>
          <Input id="ends_at" name="ends_at" type="datetime-local" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={4} maxLength={2000} placeholder="Format, rules, prizes, what to bring." />
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">Tickets</legend>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="ticketing" value="rsvp" checked={ticketing === "rsvp"} onChange={() => setTicketing("rsvp")} className="accent-[#CE2B37]" />
          Free — people register on Indian Sports Club, you see the list
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="radio" name="ticketing" value="external" checked={ticketing === "external"} onChange={() => setTicketing("external")} className="accent-[#CE2B37]" />
          Paid — link to my own ticket / payment page
        </label>
      </fieldset>
      {ticketing === "external" && (
        <div className="grid gap-3 sm:grid-cols-[1fr_10rem]">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="external_url">Ticket link</Label>
            <Input id="external_url" name="external_url" type="url" required placeholder="https://…" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="price">Price from (₹)</Label>
            <Input id="price" name="price" type="number" min={0} defaultValue={0} />
          </div>
        </div>
      )}
      {message && (
        <Alert variant={message.tone}>
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" variant="brand" loading={busy}>
        Submit for review
      </Button>
    </form>
  );
}
