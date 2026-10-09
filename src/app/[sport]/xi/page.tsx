import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SQUAD_SPORTS } from "@/lib/site";
import { XIBuilder } from "@/components/XIBuilder";

export const metadata: Metadata = {
  title: "Playing XI",
  description: "Pick your India Playing XI, validate the squad, and share it as an image.",
};

export default async function XIPage({ params }: { params: Promise<{ sport: string }> }) {
  if (!SQUAD_SPORTS.includes((await params).sport)) notFound();
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Playing XI</h1>
        <p className="text-muted-foreground">
          Pick exactly 11 with at least one wicketkeeper. Your selection is saved on this
          device.
        </p>
      </header>
      <XIBuilder />
    </div>
  );
}
