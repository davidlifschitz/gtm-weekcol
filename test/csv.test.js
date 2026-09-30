import { it, expect } from "vitest";
import { loadPage, copyCsv } from "./page.js";

it("copies a CSV of the table", async () => {
  const p = loadPage();
  p.label("2026-08-31 standup");
  expect(await copyCsv(p)).toBe(
    '"label","date","weekday","US col (Sun=1)","ISO col (Mon=1)","note"\n' +
    '"2026-08-31 standup","2026-08-31","Monday","2","1","different columns"'
  );
});

it("neutralizes formula-looking labels", async () => {
  const p = loadPage();
  p.label('BEGIN:VEVENT\nSUMMARY:=HYPERLINK("http://x")\nDTSTART:20260902\nEND:VEVENT\nBEGIN:VEVENT\nSUMMARY:@SUM(1)\nDTSTART:20260903\nEND:VEVENT');
  const lines = (await copyCsv(p)).split("\n");
  expect(lines[1].startsWith(`"'=HYPERLINK(""http://x"")"`)).toBe(true);
  expect(lines[2].startsWith(`"'@SUM(1)"`)).toBe(true);
});
