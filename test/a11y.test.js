import { it, expect } from "vitest";
import { loadPage } from "./page.js";

it("file input is keyboard reachable and labelled", () => {
  const { $, window } = loadPage();
  const f = $("file");
  expect(window.getComputedStyle(f).display).not.toBe("none");
  expect(f.tabIndex).toBeGreaterThanOrEqual(0);
  expect(f.labels.length).toBeGreaterThan(0);
});

it("textarea has a label", () => {
  const { $ } = loadPage();
  expect([...$("src").labels].map((l) => l.textContent).join(" ")).toMatch(/paste/i);
});

it("warning line is announced", () => {
  const { $ } = loadPage();
  expect($("warn").getAttribute("role")).toBe("status");
});
