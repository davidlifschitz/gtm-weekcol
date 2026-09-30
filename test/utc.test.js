import { it, expect } from "vitest";
import { loadPage } from "./page.js";

// npm test pins TZ=America/New_York
it("converts UTC ICS times to local before picking the weekday", () => {
  const p = loadPage();
  p.label("BEGIN:VEVENT\nSUMMARY:late call\nDTSTART:20260831T020000Z\nEND:VEVENT");
  expect(p.rows()[0].slice(1, 3)).toEqual(["2026-08-30", "Sunday"]);
});

it("leaves floating and TZID times alone", () => {
  const p = loadPage();
  p.label("BEGIN:VEVENT\nSUMMARY:a\nDTSTART:20260831T020000\nEND:VEVENT\nBEGIN:VEVENT\nSUMMARY:b\nDTSTART;VALUE=DATE:20260831\nEND:VEVENT");
  expect(p.rows().map((r) => r[1])).toEqual(["2026-08-31", "2026-08-31"]);
});

it("handles pasted UTC stamps too", () => {
  const p = loadPage();
  p.label("20260831T020000Z");
  expect(p.rows()[0][1]).toBe("2026-08-30");
});
