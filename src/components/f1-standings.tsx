import type { F1Season } from "@/lib/f1-data";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/** Current-season standings from Jolpica-F1. Server component; pass a season from f1Season(). */
export function F1Standings({ season, kind, limit }: { season: F1Season; kind: "drivers" | "constructors"; limit?: number }) {
  const rows: { position: number; name: string; team?: string; points: number; wins: number }[] =
    kind === "drivers" ? season.drivers : season.constructors;
  const shown = limit ? rows.slice(0, limit) : rows;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {season.season} {kind === "drivers" ? "drivers'" : "constructors'"} standings
      </h2>
      <p className="text-sm text-muted-foreground">
        {season.complete ? "Final standings" : `After round ${season.round} of ${season.total}`}. Updated automatically from
        Jolpica-F1.
      </p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">#</TableHead>
            <TableHead>{kind === "drivers" ? "Driver" : "Team"}</TableHead>
            {kind === "drivers" && <TableHead>Team</TableHead>}
            <TableHead className="text-right">Wins</TableHead>
            <TableHead className="text-right">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shown.map((r) => (
            <TableRow key={r.name}>
              <TableCell className="tabular-nums text-muted-foreground">{r.position}</TableCell>
              <TableCell className="font-medium">{r.name}</TableCell>
              {kind === "drivers" && <TableCell className="text-muted-foreground">{r.team}</TableCell>}
              <TableCell className="text-right tabular-nums">{r.wins}</TableCell>
              <TableCell className="text-right font-display font-bold tabular-nums">{r.points}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}
