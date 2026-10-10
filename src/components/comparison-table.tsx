import type { Row } from "@/lib/compare-rows";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

/** Side-by-side figures. No hooks: rendered on the server for curated pages and
 * inside the client compare tool alike. */
export function ComparisonTable({ a, b, rows }: { a: string; b: string; rows: Row[] }) {
  const groups = [...new Set(rows.map((r) => r.group))];
  const cell = (r: Row, side: "a" | "b") =>
    `text-right tabular-nums ${r.better === side ? "font-semibold text-foreground" : "text-muted-foreground"}`;
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead />
          <TableHead className="text-right">{a}</TableHead>
          <TableHead className="text-right">{b}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {groups.map((g) => (
          <GroupRows key={g} group={g} rows={rows.filter((r) => r.group === g)} cell={cell} />
        ))}
      </TableBody>
    </Table>
  );
}

function GroupRows({ group, rows, cell }: { group: string; rows: Row[]; cell: (r: Row, s: "a" | "b") => string }) {
  return (
    <>
      <TableRow className="bg-muted/40 hover:bg-muted/40">
        <TableCell colSpan={3} className="py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {group}
        </TableCell>
      </TableRow>
      {rows.map((r) => (
        <TableRow key={`${group}-${r.label}`}>
          <TableCell>{r.label}</TableCell>
          <TableCell className={cell(r, "a")}>
            {r.a}
            {r.better === "a" && <span className="sr-only"> (better)</span>}
          </TableCell>
          <TableCell className={cell(r, "b")}>
            {r.b}
            {r.better === "b" && <span className="sr-only"> (better)</span>}
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
