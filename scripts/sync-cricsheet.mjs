// Adds new Cricsheet matches to src/data/cricket-live.json.
// Usage: node scripts/sync-cricsheet.mjs <folder of Cricsheet JSON files>
// Run weekly by .github/workflows/cricket-data.yml on the last-30-days download.
// Fails (non-zero exit, nothing written) on figures that look wrong, so a bad
// download never reaches the site.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { summarise } from "../src/lib/cricsheet.ts";
import { RECORDS } from "../src/data/records.ts";

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node scripts/sync-cricsheet.mjs <folder>");
  process.exit(2);
}

const file = new URL("../src/data/cricket-live.json", import.meta.url);
const live = JSON.parse(readFileSync(file, "utf8"));
const tracked = new Set(RECORDS.flatMap((r) => r.rows.map((x) => x.cricsheet).filter(Boolean)));
// Nothing before the oldest baseline can matter.
const earliest = RECORDS.filter((r) => r.live && r.rows.some((x) => x.cricsheet))
  .map((r) => r.live.since)
  .sort()[0];

let added = 0;
for (const name of readdirSync(dir).filter((f) => f.endsWith(".json"))) {
  const id = name.replace(/\.json$/, "");
  if (live.matches[id]) continue;
  const match = JSON.parse(readFileSync(join(dir, name), "utf8"));
  if (!match.info?.dates?.[0] || match.info.dates[0] <= earliest) continue;
  const entry = summarise(match, tracked);
  if (!entry) continue;
  for (const [player, p] of Object.entries(entry.players)) {
    if (p.runs < 0 || p.runs > 500 || p.wickets < 0 || p.wickets > 20) {
      console.error(`Implausible figures for ${player} in match ${id}:`, p);
      process.exit(1);
    }
  }
  live.matches[id] = entry;
  added += 1;
}

const dates = Object.values(live.matches).map((m) => m.date).sort();
live.updated = dates.at(-1) ?? live.updated;
// Stable key order keeps diffs small.
live.matches = Object.fromEntries(Object.entries(live.matches).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(file, JSON.stringify(live, null, 2) + "\n");
console.log(`Added ${added} match(es); ${Object.keys(live.matches).length} tracked; newest ${live.updated}.`);
