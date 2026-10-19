import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readCss = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");

test("package entry point imports the complete stylesheet", async () => {
  const entry = await readCss("index.css");

  for (const file of ["tokens.css", "foundation.css", "utilities.css", "components.css"]) {
    assert.ok(entry.includes(`@import "./${file}"`), `${file} should be imported`);
  }
});

test("design tokens keep the spacing scale on multiples of eight", async () => {
  const tokens = await readCss("tokens.css");

  for (const [name, value] of [
    ["--am-space-1", "0.5rem"],
    ["--am-space-2", "1rem"],
    ["--am-space-3", "1.5rem"],
    ["--am-space-4", "2rem"],
    ["--am-space-5", "2.5rem"],
    ["--am-space-6", "3rem"],
    ["--am-space-8", "4rem"]
  ]) {
    assert.match(tokens, new RegExp(`${name}: ${value.replace(".", "\\.")};`));
  }
});

test("responsive grid follows the 12, 6 and 2 column brand layouts", async () => {
  const utilities = await readCss("utilities.css");

  assert.match(utilities, /grid-template-columns:\s*repeat\(12,/);
  assert.match(utilities, /grid-template-columns:\s*repeat\(6,/);
  assert.match(utilities, /grid-template-columns:\s*repeat\(2,/);
});

test("components include keyboard focus and reduced-motion support", async () => {
  const [components, foundation, tokens] = await Promise.all([
    readCss("components.css"),
    readCss("foundation.css"),
    readCss("tokens.css")
  ]);

  assert.match(components, /:focus-visible/);
  assert.match(components, /\.am-button--primary::before/);
  assert.match(components, /width:\s*0;/);
  assert.match(components, /width:\s*100%;/);
  assert.match(components, /width 350ms ease/);
  assert.match(tokens, /--am-gradient-cta:/);
  assert.match(foundation, /prefers-reduced-motion:\s*reduce/);
});

test("showcase documents interactive accessible components", async () => {
  const [markup, script, siteStyles, regularFont, semiboldFont] = await Promise.all([
    readFile(new URL("../docs/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/showcase.js", import.meta.url), "utf8"),
    readFile(new URL("../docs/site.css", import.meta.url), "utf8"),
    readFile(new URL("../docs/assets/fonts/GilroyW05-Regular.woff2", import.meta.url)),
    readFile(new URL("../docs/assets/fonts/GilroyW05-SemiBold.woff2", import.meta.url))
  ]);

  for (const feature of [
    'role="tablist"',
    '<table class="am-table"',
    'type="range"',
    'role="switch"',
    '<dialog class="am-dialog"',
    'class="am-pagination"'
  ]) {
    assert.ok(markup.includes(feature), `${feature} should appear in the showcase`);
  }
  assert.match(markup, /src="\.\/showcase\.js"/);
  assert.match(script, /ArrowRight/);
  assert.match(script, /data-sort/);
  assert.match(script, /data-page-step/);
  assert.match(siteStyles, /font-weight:\s*400/);
  assert.match(siteStyles, /font-weight:\s*600/);
  assert.ok(regularFont.length > 0);
  assert.ok(semiboldFont.length > 0);
});
