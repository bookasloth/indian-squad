import type { Metadata } from "next";
import Link from "next/link";
import { listProducts } from "@/lib/shop";
import { formatInr } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/shop" },
  title: "Shop",
  description: "Indian Sports Club merch — tees and more for the 12th Man. Printed to order, shipped across India.",
};

export default async function ShopPage() {
  const products = await listProducts();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Shop</h1>
        <p className="text-muted-foreground">Merch for the 12th Man. Printed to order, free shipping across India.</p>
      </header>

      {products.length === 0 ? (
        <EmptyState title="The first drop is on its way" description="Join the newsletter to hear when the merch lands." />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p, i) => (
            <li key={p.id}>
              <Link href={`/shop/${p.slug}`} className="block h-full">
                <Card interactive className="flex h-full flex-col overflow-hidden">
                  {p.images[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.images[0]}
                      alt={p.title}
                      // First row is above the fold; the rest can wait for scroll.
                      loading={i < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className="aspect-square w-full bg-muted object-cover"
                    />
                  )}
                  <div className="flex flex-1 flex-col gap-1 p-4">
                    <h2 className="font-display text-lg font-semibold tracking-tight">{p.title}</h2>
                    <p className="mt-auto pt-1 font-semibold">{formatInr(p.price)}</p>
                  </div>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
