// Builds src/data/player-stats.json from Cricsheet's full Test, ODI and T20I archives.
// Usage: node scripts/build-player-stats.mjs <folder with tests/ odis/ t20s/ subfolders>
// Run weekly by .github/workflows/cricket-data.yml. Rebuilt from scratch each time,
// so corrections in Cricsheet flow through.
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { addMatch } from "../src/lib/player-stats.ts";
import { players } from "../src/data/players.ts";

const root = process.argv[2];
if (!root) {
  console.error("Usage: node scripts/build-player-stats.mjs <folder>");
  process.exit(2);
}

const tracked = new Set(players.map((p) => p.cricsheet).filter(Boolean));
const out = {};
let matches = 0;
for (const dir of ["tests", "odis", "t20s"]) {
  for (const f of readdirSync(join(root, dir)).filter((x) => x.endsWith(".json"))) {
    const match = JSON.parse(readFileSync(join(root, dir, f), "utf8"));
    if (match.info?.team_type === "international" && match.info.teams?.includes("India")) matches += 1;
    addMatch(out, match, tracked);
  }
}

// A roster player with no data at all usually means a wrong Cricsheet id.
const missing = players.filter((p) => p.cricsheet && !out[p.cricsheet]).map((p) => p.slug);
if (missing.length) {
  console.error("No Cricsheet data for:", missing.join(", "));
  process.exit(1);
}

const latest = Object.values(out)
  .flatMap((p) => Object.values(p).map((s) => s.last))
  .sort()
  .at(-1);
const file = new URL("../src/data/player-stats.json", import.meta.url);
writeFileSync(file, JSON.stringify({ updated: latest, players: out }) + "\n");
console.log(`Players: ${Object.keys(out).length}; India matches used: ${matches}; newest ${latest}.`);
