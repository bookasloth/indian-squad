"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ProfileFollowButton({
  followeeId,
  initialFollowing,
}: {
  followeeId: string;
  initialFollowing: boolean;
}) {
  const [following, setFollowing] = useState(initialFollowing);
  const [busy, setBusy] = useState(false);

  async function toggle() {
    const next = !following;
    setBusy(true);
    setFollowing(next);
    try {
      const res = await fetch("/api/follows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followeeId, follow: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setFollowing(!next);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button variant={following ? "outline" : "brand"} size="sm" onClick={toggle} disabled={busy}>
      {following ? "Following" : "Follow"}
    </Button>
  );
}
