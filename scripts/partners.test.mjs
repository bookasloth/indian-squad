// Run: npm test. Partner applications and events cross a trust boundary.
import { test } from "node:test";
import assert from "node:assert/strict";
import { parsePartnerApplication, parsePartnerEvent } from "../src/lib/partner-validate.ts";

const app = {
  org_name: "Nagpur Box Cricket League",
  contact_name: "Ravi K",
  phone: "+91 98765 43210",
  city: "Nagpur",
  sports: ["cricket"],
  about: "Weekend box-cricket tournaments.",
  website: "https://instagram.com/nbcl",
  agree: true,
};

test("application: valid input passes and normalises the phone", () => {
  const r = parsePartnerApplication(app);
  assert.equal(r.ok, true);
  assert.equal(r.value.phone, "9876543210");
});

test("application: rejects missing terms, bad sport, bad phone, http link", () => {
  for (const bad of [
    { ...app, agree: false },
    { ...app, sports: [] },
    { ...app, sports: ["chess"] },
    { ...app, phone: "12345" },
    { ...app, website: "http://example.com" },
    { ...app, org_name: "x" },
  ]) assert.equal(parsePartnerApplication(bad).ok, false, JSON.stringify(bad));
});

const now = Date.parse("2026-10-08T00:00:00+05:30");
const ev = {
  title: "Diwali Box Cricket Cup",
  description: "12 teams, 6-a-side.",
  sport: "cricket",
  venue: "Turf 22",
  city: "Nagpur",
  starts_at: "2026-10-24T19:30",
  ends_at: "2026-10-24T23:00",
  ticketing: "rsvp",
  capacity: "60",
};

test("event: rsvp event is free and times are read as IST", () => {
  const r = parsePartnerEvent({ ...ev, price: 999 }, now);
  assert.equal(r.ok, true);
  assert.equal(r.value.price, 0);
  assert.equal(r.value.starts_at, "2026-10-24T19:30:00+05:30");
  assert.equal(r.value.capacity, 60);
});

test("event: external needs an https link; price shown as given", () => {
  assert.equal(parsePartnerEvent({ ...ev, ticketing: "external" }, now).ok, false);
  const r = parsePartnerEvent({ ...ev, ticketing: "external", external_url: "https://pay.example.com/e/1", price: 499 }, now);
  assert.equal(r.ok, true);
  assert.equal(r.value.price, 499);
});

test("event: rejects past start, end before start, paid ticketing, bad capacity", () => {
  for (const bad of [
    { ...ev, starts_at: "2026-10-01T10:00" },
    { ...ev, ends_at: "2026-10-24T18:00" },
    { ...ev, ticketing: "paid" },
    { ...ev, capacity: "0" },
    { ...ev, capacity: "2.5" },
    { ...ev, starts_at: "tomorrow" },
  ]) assert.equal(parsePartnerEvent(bad, now).ok, false, JSON.stringify(bad));
});
