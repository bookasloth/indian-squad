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
  return product ? { title: product.title, description: product.description.slice(0, 160) } : {};
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getProduct((await params).slug);
  if (!product) notFound();
  const { user } = await getMemberContext();

  return (
    <article className="grid gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-3">
        {product.images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={src} src={src} alt={i === 0 ? product.title : ""} className="w-full rounded-card border border-border bg-muted object-cover" />
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <Link href="/shop" className="text-sm text-muted-foreground hover:text-foreground">
          ← All merch
        </Link>
        <h1 className="font-display text-3xl font-bold tracking-tight">{product.title}</h1>
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
