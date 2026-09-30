import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";

const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");

export function loadPage() {
  const dom = new JSDOM(html, { runScripts: "dangerously", pretendToBeVisual: true });
  const { document } = dom.window;
  const $ = (id) => document.getElementById(id);
  const label = (text) => {
    $("src").value = text;
    $("run").click();
  };
  const rows = () =>
    [...$("tbl").querySelectorAll("tr")].slice(1).map((tr) => [...tr.cells].map((c) => c.textContent));
  return { dom, window: dom.window, document, $, label, rows };
}

export async function copyCsv(p) {
  let text;
  Object.defineProperty(p.window.navigator, "clipboard", { value: { writeText: async (t) => { text = t; } } });
  await p.$("copy").onclick();
  return text;
}
