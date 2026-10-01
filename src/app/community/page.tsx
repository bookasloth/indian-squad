import type { Metadata } from "next";
import { getSupabase } from "@/lib/supabase";
import { CommunityFeed } from "@/components/CommunityFeed";
import type { Post } from "@/data/community";

export const metadata: Metadata = {
  title: "Community — Indian Squad",
  description: "Talk Indian cricket with other fans. No sign-up required.",
};

// Feed reflects the latest posts on each request.
export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const sb = getSupabase();
  let posts: Post[] = [];
  if (sb) {
    const { data } = await sb
      .from("is_posts")
      .select("id,author_name,body,parent_id,created_at")
      .order("created_at", { ascending: true });
    posts = (data as Post[] | null) ?? [];
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Community</h1>
        <p className="text-muted">Talk cricket with other fans. No sign-up — just a name.</p>
      </header>

      {sb ? (
        <CommunityFeed initialPosts={posts} />
      ) : (
        <p className="rounded-lg border border-border bg-surface px-4 py-3 text-sm text-muted">
          The community feed isn&apos;t configured yet. Set the Supabase environment
          variables and apply the migration to enable it.
        </p>
      )}
    </div>
  );
}
