"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { post } from "@/lib/checkout";
import { SPORTS } from "@/lib/site";

export function PartnerApplyForm({ defaultName }: { defaultName?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError(null);
    try {
      await post("/api/partners/apply", {
        org_name: f.get("org_name"),
        contact_name: f.get("contact_name"),
        phone: f.get("phone"),
        city: f.get("city"),
        sports: f.getAll("sports"),
        about: f.get("about"),
        website: f.get("website"),
        agree: f.get("agree") === "on",
      });
      router.push("/partners/dashboard");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="org_name">Organisation / club name</Label>
        <Input id="org_name" name="org_name" required maxLength={100} placeholder="e.g. Nagpur Box Cricket League" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="contact_name">Contact person</Label>
          <Input id="contact_name" name="contact_name" required maxLength={80} defaultValue={defaultName} autoComplete="name" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="phone">Mobile (not shown publicly)</Label>
          <Input id="phone" name="phone" type="tel" required placeholder="10 digits" autoComplete="tel" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="city">City</Label>
        <Input id="city" name="city" required maxLength={60} autoComplete="address-level2" />
      </div>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">Sports you run events for</legend>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          {SPORTS.map((s) => (
            <label key={s.slug} className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="sports" value={s.slug} className="size-4 accent-[#CE2B37]" />
              {s.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="about">About your events (optional)</Label>
        <Textarea id="about" name="about" rows={3} maxLength={1000} placeholder="What you run, how often, where." />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="website">Website or Instagram (optional)</Label>
        <Input id="website" name="website" type="url" placeholder="https://instagram.com/yourclub" />
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="agree" required className="mt-0.5 size-4 accent-[#CE2B37]" />
        <span>
          I agree to the{" "}
          <Link href="/partners/terms" className="underline underline-offset-4" target="_blank">
            partner terms
          </Link>{" "}
          and confirm the details are true.
        </span>
      </label>
      {error && (
        <Alert variant="danger">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button type="submit" variant="brand" size="lg" loading={busy}>
        Apply
      </Button>
    </form>
  );
}
