import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Route/section loading fallbacks. Each mirrors the real page's layout (same grid,
 * gaps and block heights) so content swaps in without a shift. All are wrapped in
 * `.skeleton-reveal`: invisible for the first 150ms, so fast loads never flash.
 */
export function Loading({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <div role="status" aria-live="polite" className={cn("skeleton-reveal", className)}>
      <span className="sr-only">Loading {label}…</span>
      <div aria-hidden className="contents">
        {children}
      </div>
    </div>
  );
}

/** h1 + intro line, as on every listing page. */
export function PageHeaderSkeleton({ big }: { big?: boolean }) {
  return (
    <header className="flex flex-col gap-2">
      <Skeleton className={big ? "h-10 w-72 max-w-full" : "h-9 w-48"} />
      <Skeleton className="h-5 w-96 max-w-full" />
    </header>
  );
}

function PostSkeleton() {
  return (
    <div className="flex gap-3 py-1.5">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex flex-1 flex-col gap-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-1 h-4 w-40" />
      </div>
    </div>
  );
}

/** Composer box + a column of posts (CommunityFeed). */
export function FeedSkeleton({ composer = true, posts = 4 }: { composer?: boolean; posts?: number }) {
  return (
    <Loading label="posts" className="flex flex-col gap-8">
      {composer && (
        <div className="flex gap-3 rounded-card border border-border p-4">
          <Skeleton className="size-10 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-[82px] w-full" />
            <Skeleton className="h-8 w-20 self-end" />
          </div>
        </div>
      )}
      <div className="flex flex-col gap-6">
        {Array.from({ length: posts }, (_, i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    </Loading>
  );
}

/** Community screen: heading, sport chips, then the feed. */
export function CommunitySkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Loading label="community" className="flex flex-col gap-6">
        <PageHeaderSkeleton />
        <div className="flex flex-wrap gap-2">
          {[12, 16, 20, 16, 18, 14].map((w, i) => (
            <Skeleton key={i} className="h-[30px] rounded-full" style={{ width: `${w * 4}px` }} />
          ))}
        </div>
      </Loading>
      <FeedSkeleton />
    </div>
  );
}

/** Member profile: back link, avatar header, posts. */
export function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <Loading label="profile" className="flex flex-col gap-8">
        <Skeleton className="h-5 w-16" />
        <div className="flex items-start gap-4">
          <Skeleton className="size-16 shrink-0 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-52" />
          </div>
        </div>
      </Loading>
      <FeedSkeleton composer={false} posts={3} />
    </div>
  );
}

/** Heading + avatar rows (notifications, moderation, review queue). */
export function ListSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Loading label="list" className="flex flex-col gap-6">
      <Skeleton className="h-9 w-56" />
      <div className="flex flex-col divide-y divide-border">
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <Skeleton className="size-9 shrink-0 rounded-full" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </div>
    </Loading>
  );
}

/** Card grid (events, shop, partner events). `media` adds the square product image. */
export function CardGridSkeleton({
  count = 4,
  media,
  className = "sm:grid-cols-2",
}: {
  count?: number;
  media?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-4", className)}>
      {Array.from({ length: count }, (_, i) =>
        media ? (
          <div key={i} className="overflow-hidden rounded-card border border-border">
            <Skeleton className="aspect-square w-full rounded-none" />
            <div className="flex flex-col gap-2 p-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-16" />
            </div>
          </div>
        ) : (
          <div key={i} className="flex flex-col gap-2 rounded-card border border-border p-5">
            <Skeleton className="h-[22px] w-16 rounded-full" />
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="mt-2 h-5 w-14" />
          </div>
        ),
      )}
    </div>
  );
}

/** Listing page: header + card grid. */
export function GridPageSkeleton({ label, media, gridClassName }: { label: string; media?: boolean; gridClassName?: string }) {
  return (
    <Loading label={label} className="flex flex-col gap-8">
      <PageHeaderSkeleton />
      <CardGridSkeleton media={media} count={media ? 6 : 4} className={gridClassName} />
    </Loading>
  );
}

/** Event detail: narrow article, title block, description, ticket box. */
export function EventSkeleton() {
  return (
    <Loading label="event" className="mx-auto flex max-w-prose flex-col gap-6">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-[22px] w-16 rounded-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-14 w-72 max-w-full" />
      </div>
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/5" />
      </div>
      <div className="flex flex-col gap-3 rounded-card border border-border p-5">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-12 w-48" />
      </div>
    </Loading>
  );
}

/** Product detail: image column + sticky buy column. */
export function ProductSkeleton() {
  return (
    <Loading label="product" className="grid gap-6 md:grid-cols-2 md:items-start md:gap-8">
      <Skeleton className="aspect-square max-h-[60vh] w-full rounded-card md:max-h-none" />
      <div className="flex flex-col gap-5">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-9 w-3/4" />
        <Skeleton className="h-8 w-24" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 4 }, (_, i) => (
            <Skeleton key={i} className="h-10 w-12" />
          ))}
        </div>
        <Skeleton className="h-12 w-full" />
      </div>
    </Loading>
  );
}
