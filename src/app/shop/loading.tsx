import { GridPageSkeleton } from "@/components/layout/page-skeletons";

export default function Loading() {
  return <GridPageSkeleton label="shop" media gridClassName="sm:grid-cols-2 lg:grid-cols-3" />;
}
