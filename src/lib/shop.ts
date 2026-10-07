import "server-only";

import { supabaseAnon } from "@/lib/supabase/server";

export type ProductRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  sizes: string[];
};

const COLS = "id, slug, title, description, price, images, sizes";

/** Active products in display order. RLS hides inactive ones from the anon client. */
export async function listProducts(): Promise<ProductRow[]> {
  const { data } = await supabaseAnon().from("is_products").select(COLS).order("sort").order("created_at");
  return (data ?? []) as ProductRow[];
}

export async function getProduct(slug: string): Promise<ProductRow | null> {
  const { data } = await supabaseAnon().from("is_products").select(COLS).eq("slug", slug).maybeSingle<ProductRow>();
  return data;
}
