export function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
      <p className="text-muted">Coming soon.</p>
    </div>
  );
}
