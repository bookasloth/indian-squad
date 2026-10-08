// Run: npm test. safeNext is the open-redirect boundary for every auth flow.
import { test } from "node:test";
import assert from "node:assert/strict";
import { safeNext } from "../src/lib/auth/redirect.ts";

test("allows the app's own return paths", () => {
  assert.equal(safeNext("/community"), "/community");
  assert.equal(safeNext("/community/u/fan_1a2b"), "/community/u/fan_1a2b");
  assert.equal(safeNext("/events/ind-nz-watch-party"), "/events/ind-nz-watch-party");
  assert.equal(safeNext("/events?x=1"), "/events?x=1");
  assert.equal(safeNext("/partners/apply"), "/partners/apply");
});

test("drops off-site, look-alike and unknown paths", () => {
  for (const bad of ["https://evil.com", "//evil.com", "/\\evil.com", "/eventsevil", "/partnersx", "/admin", "", null, undefined]) {
    assert.equal(safeNext(bad), null, String(bad));
  }
});
