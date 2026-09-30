import { it, expect } from "vitest";
import { loadPage } from "./page.js";

it("does not render ICS summaries as HTML", () => {
  const p = loadPage();
  p.label("BEGIN:VEVENT\nSUMMARY:<img src=x onerror=alert(1)>\nDTSTART:20260902\nEND:VEVENT");
  expect(p.$("tbl").querySelector("img")).toBeNull();
  expect(p.rows()[0][0]).toBe("<img src=x onerror=alert(1)>");
});

it("does not render pasted lines as HTML", () => {
  const p = loadPage();
  p.label("<b>x</b> 2026-09-02");
  expect(p.$("tbl").querySelector("b")).toBeNull();
});
