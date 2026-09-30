import { it, expect } from "vitest";
import { loadPage } from "./page.js";

it("warns when pasted rows go past the cap", () => {
  const p = loadPage();
  p.label(Array.from({ length: 450 }, () => "2026-09-02").join("\n"));
  expect(p.rows().length).toBe(400);
  expect(p.$("warn").textContent).toMatch(/400/);
});

it("warns when ICS events go past the cap", () => {
  const p = loadPage();
  const ev = "BEGIN:VEVENT\nSUMMARY:x\nDTSTART:20260902\nEND:VEVENT\n";
  p.label(ev.repeat(401));
  expect(p.rows().length).toBe(400);
  expect(p.$("warn").textContent).toMatch(/400/);
});

it("no warning under the cap", () => {
  const p = loadPage();
  p.label("2026-09-02");
  expect(p.$("warn").textContent).toBe("");
});

it("file picker rejects files over 8 MB", async () => {
  const p = loadPage();
  const file = { size: 9 * 1024 * 1024, name: "big.ics", text: async () => "BEGIN:VEVENT" };
  Object.defineProperty(p.$("file"), "files", { value: [file] });
  p.$("file").dispatchEvent(new p.window.Event("change"));
  await new Promise((r) => setTimeout(r, 0));
  expect(p.$("src").value).toBe("");
  expect(p.$("warn").textContent).toMatch(/8 MB/);
});
