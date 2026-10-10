import type { TableRow as Row } from "@/lib/football-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/** A football league table (P W D L GD Pts). */
export function LeagueTable({ title, rows, source }: { title: string; rows: Row[]; source: string }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-semibold tracking-tight">{title}</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>Club</TableHead>
            <TableHead className="text-right">P</TableHead>
            <TableHead className="text-right">W</TableHead>
            <TableHead className="text-right">D</TableHead>
            <TableHead className="text-right">L</TableHead>
            <TableHead className="text-right">GD</TableHead>
            <TableHead className="text-right">Pts</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.team}>
              <TableCell className="tabular-nums text-muted-foreground">{r.rank}</TableCell>
              <TableCell className="font-medium">{r.team}</TableCell>
              <TableCell className="text-right tabular-nums">{r.played}</TableCell>
              <TableCell className="text-right tabular-nums">{r.won}</TableCell>
              <TableCell className="text-right tabular-nums">{r.drawn}</TableCell>
              <TableCell className="text-right tabular-nums">{r.lost}</TableCell>
              <TableCell className="text-right tabular-nums">{r.goalDiff > 0 ? `+${r.goalDiff}` : r.goalDiff}</TableCell>
              <TableCell className="text-right font-display font-bold tabular-nums">{r.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="text-sm text-muted-foreground">Updated automatically from {source} every few hours.</p>
    </section>
  );
}
