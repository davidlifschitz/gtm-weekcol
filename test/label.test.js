import { it, expect } from "vitest";
import { loadPage } from "./page.js";

it("labels pasted dates with both columns", () => {
  const p = loadPage();
  p.label("2026-08-30\n2026-08-31 standup");
  expect(p.rows()).toEqual([
    ["2026-08-30", "2026-08-30", "Sunday", "1", "7", "different columns"],
    ["2026-08-31 standup", "2026-08-31", "Monday", "2", "1", "different columns"],
  ]);
});

it("reads ICS events", () => {
  const p = loadPage();
  p.label("BEGIN:VCALENDAR\r\nBEGIN:VEVENT\r\nSUMMARY:Retro\r\nDTSTART;TZID=Europe/Berlin:20260902T100000\r\nEND:VEVENT\r\nEND:VCALENDAR");
  expect(p.rows()[0].slice(0, 3)).toEqual(["Retro", "2026-09-02", "Wednesday"]);
});

it("warns when nothing parses", () => {
  const p = loadPage();
  p.label("no dates here");
  expect(p.$("warn").textContent).toMatch(/No dates/);
});
