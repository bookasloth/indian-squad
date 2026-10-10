import type { Fixture } from "@/lib/fixtures";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const TYPE: Record<string, string> = { test: "Test", odi: "ODI", t20: "T20" };

const when = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

/** Upcoming fixtures, times in IST. Shows a Format column only when the data has one. */
export function FixtureTable({ fixtures, source }: { fixtures: Fixture[]; source: string }) {
  const hasFormat = fixtures.some((f) => f.matchType);
  return (
    <section className="flex flex-col gap-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>When (IST)</TableHead>
            <TableHead>Match</TableHead>
            {hasFormat && <TableHead>Format</TableHead>}
            <TableHead>Venue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {fixtures.map((f) => (
            <TableRow key={f.id}>
              <TableCell className="whitespace-nowrap tabular-nums">{when(f.start)}</TableCell>
              <TableCell>
                <span className="font-medium">{f.name}</span>
                {f.series && <span className="block text-sm text-muted-foreground">{f.series}</span>}
              </TableCell>
              {hasFormat && (
                <TableCell className="text-muted-foreground">{TYPE[f.matchType] ?? f.matchType.toUpperCase()}</TableCell>
              )}
              <TableCell className="text-muted-foreground">{f.venue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-muted-foreground">Updated automatically from {source} every few hours.</p>
    </section>
  );
}
