import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { allow } from "@/lib/rate-limit";
import { getSquadPlayer } from "@/data/squads";
import { pairKey, validVote } from "@/lib/compare";

// Fan votes on player comparisons.
// GET  ?sport=&a=&b=          → { counts: { [slug]: n }, mine: slug | null }
// POST { sport, a, b, choice } → cast or change your vote (signed in).

const configured = () => !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET(request: Request) {
  if (!configured()) return NextResponse.json({ counts: {}, mine: null });
  const url = new URL(request.url);
  const sport = url.searchParams.get("sport") ?? "";
  const a = url.searchParams.get("a") ?? "";
  const b = url.searchParams.get("b") ?? "";
  if (!getSquadPlayer(sport, a) || !getSquadPlayer(sport, b) || a === b) {
    return NextResponse.json({ error: "Invalid pair." }, { status: 400 });
  }

  const sb = await createClient();
  // ponytail: counts are tallied from rows; switch to a counting RPC if a pair
  // ever gets tens of thousands of votes.
  const [{ data: rows }, { data: auth }] = await Promise.all([
    sb.from("is_compare_votes").select("choice, user_id").eq("sport", sport).eq("pair", pairKey(a, b)),
    sb.auth.getUser(),
  ]);
  const counts: Record<string, number> = { [a]: 0, [b]: 0 };
  let mine: string | null = null;
  for (const r of rows ?? []) {
    counts[r.choice] = (counts[r.choice] ?? 0) + 1;
    if (auth.user && r.user_id === auth.user.id) mine = r.choice;
  }
  return NextResponse.json({ counts, mine }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (!configured()) return NextResponse.json({ error: "Not configured." }, { status: 503 });
  const sb = await createClient();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to vote." }, { status: 401 });
  if (!(await allow(`compare-vote:${user.id}`, 30, 60_000))) {
    return NextResponse.json({ error: "Slow down." }, { status: 429 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) ?? {};
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  const sport = typeof payload.sport === "string" ? payload.sport : "";
  const vote = validVote((s) => !!getSquadPlayer(sport, s), payload.a, payload.b, payload.choice);
  if (!vote) return NextResponse.json({ error: "Invalid vote." }, { status: 400 });

  const { error } = await sb.from("is_compare_votes").upsert(
    { sport, pair: vote.pair, user_id: user.id, choice: vote.choice, updated_at: new Date().toISOString() },
    { onConflict: "sport,pair,user_id" },
  );
  if (error) return NextResponse.json({ error: "Could not record your vote." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
