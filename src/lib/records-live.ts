import { since, type CricketLive } from "@/lib/cricsheet";
import type { RecordList } from "@/data/records";
import liveData from "@/data/cricket-live.json";

const num = (s: string) => Number(s.replace(/,/g, ""));
const fmt = (n: number) => n.toLocaleString("en-IN");
const longDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** A record list with Cricsheet matches since its baseline added to tracked players,
 * re-sorted, and dated by the newest match counted.
 * ponytail: only listed players move; someone just outside the top ten can't climb
 * in until the baseline is refreshed by hand. */
export function withLive(r: RecordList, live: CricketLive = liveData as CricketLive): RecordList {
  if (!r.live) return r;
  const { format, stat, since: after } = r.live;
  let latest: string | null = null;
  const rows = r.rows.map((row) => {
    if (!row.cricsheet) return row;
    const d = since(live, row.cricsheet, format, after, stat);
    if (d.matches === 0) return row;
    if (d.latest && (!latest || d.latest > latest)) latest = d.latest;
    return {
      ...row,
      value: fmt(num(row.value) + d.value),
      // IPL rows list teams, not matches.
      detail: format === "ipl" ? row.detail : fmt(num(row.detail) + d.matches),
    };
  });
  if (!latest) return r;
  return { ...r, rows: [...rows].sort((a, b) => num(b.value) - num(a.value)), asOf: longDate(latest) };
}
