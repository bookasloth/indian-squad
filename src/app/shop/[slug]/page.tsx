import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/shop";
import { paymentsEnabled } from "@/lib/events";
import { getMemberContext } from "@/lib/members/session";
import { MAX_QUANTITY } from "@/lib/shop-validate";
import { formatInr } from "@/lib/utils";
import { ProductBuyForm } from "@/components/shop/product-buy-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getProduct((await params).slug);
  return product
    ? { title: product.title, description: product.description.slice(0, 160), alternates: { canonical: `/shop/${product.slug}` } }
    : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const { user } = await getMemberContext();

  return (
    <article className="grid gap-6 md:grid-cols-2 md:items-start md:gap-8">
      {/* Phone: swipeable row capped at ~60% of the screen so price + Pay stay in reach. Desktop: stacked. */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 md:mx-0 md:flex-col md:overflow-visible md:px-0">
        {product.images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt={i === 0 ? product.title : ""}
            // The first image is the page's LCP; the rest sit off-screen in the swipe row.
            loading={i === 0 ? "eager" : "lazy"}
            fetchPriority={i === 0 ? "high" : "auto"}
            decoding="async"
            className={`max-h-[60vh] shrink-0 snap-center rounded-card border border-border bg-muted object-cover md:max-h-none md:w-full ${product.images.length > 1 ? "w-[85%]" : "w-full"}`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-5 md:sticky md:top-20">
        <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">
          ← All merch
        </Link>
        <h1 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{product.title}</h1>
        <p className="text-2xl font-bold">{formatInr(product.price)}</p>
        {product.description && <p className="whitespace-pre-line text-muted-foreground">{product.description}</p>}

        {paymentsEnabled() ? (
          <ProductBuyForm
            productId={product.id}
            price={product.price}
            sizes={product.sizes}
            maxQuantity={MAX_QUANTITY}
            name={user?.user_metadata?.full_name}
            email={user?.email}
          />
        ) : (
          <p className="text-muted-foreground">Orders open soon.</p>
        )}

        <p className="text-sm text-muted-foreground">
          See{" "}
          <Link href="/shipping-policy" className="underline underline-offset-4">
            Shipping
          </Link>{" "}
          and{" "}
          <Link href="/refund-policy" className="underline underline-offset-4">
            Cancellations &amp; Refunds
          </Link>
          .
        </p>
      </div>
    </article>
  );
}
