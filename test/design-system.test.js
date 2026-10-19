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
  const [utilities, tokens] = await Promise.all([
    readCss("utilities.css"),
    readCss("tokens.css")
  ]);

  assert.match(tokens, /--am-grid-columns:\s*12;/);
  assert.match(tokens, /--am-grid-columns-tablet:\s*6;/);
  assert.match(tokens, /--am-grid-columns-mobile:\s*2;/);
  assert.match(utilities, /grid-template-columns:\s*repeat\(var\(--am-grid-columns\),/);
  assert.match(utilities, /grid-template-columns:\s*repeat\(var\(--am-grid-columns-tablet\),/);
  assert.match(utilities, /grid-template-columns:\s*repeat\(var\(--am-grid-columns-mobile\),/);
  assert.match(utilities, /\.am-container\s*\{[\s\S]*?calc\(100% - var\(--am-space-4\)\)/);
  assert.match(utilities, /@media \(max-width: 47\.999rem\)[\s\S]*?var\(--am-grid-gutter\)/);
});

test("components include keyboard focus and reduced-motion support", async () => {
  const [components, foundation, tokens] = await Promise.all([
    readCss("components.css"),
    readCss("foundation.css"),
    readCss("tokens.css")
  ]);

  assert.match(components, /:focus-visible/);
  assert.match(tokens, /--am-focus-outline-width:\s*3px;/);
  assert.match(tokens, /--am-focus-outline-offset:\s*3px;/);
  assert.match(foundation, /outline:\s*var\(--am-focus-outline-width\)/);
  assert.match(components, /outline-offset:\s*var\(--am-focus-outline-offset\)/);
  assert.match(components, /\.am-button--primary::before/);
  assert.match(components, /width:\s*0;/);
  assert.match(components, /width:\s*100%;/);
  assert.match(components, /width 350ms ease/);
  assert.match(components, /\.am-link\s*\{[^}]*text-decoration:\s*none;/s);
  assert.match(components, /\.am-link::after\s*\{[^}]*bottom:\s*calc\(0rem - var\(--am-space-1\)\);/s);
  assert.match(components, /\.am-link:hover::after,[\s\S]*?animation:\s*am-link-underline 600ms/);
  assert.match(components, /\.am-link::after\s*\{[^}]*background:\s*currentColor;/s);
  assert.match(components, /@keyframes am-link-underline[\s\S]*?38%[\s\S]*?transform:\s*scaleX\(0\)[\s\S]*?48%[\s\S]*?transform:\s*scaleX\(0\)[\s\S]*?100%[\s\S]*?transform:\s*scaleX\(1\)/);
  assert.match(components, /\.am-breadcrumb a\s*\{[^}]*text-underline-offset:\s*var\(--am-space-1\);/s);
  assert.match(components, /\.am-menu-caret\s*\{[^}]*transition:\s*transform var\(--am-motion-duration\)/s);
  assert.match(components, /\.am-menu\[open\] \.am-menu-caret\s*\{[^}]*rotate\(180deg\)/s);
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
    'class="am-pagination"',
    'class="am-menu-caret" aria-hidden="true">↓</span>'
  ]) {
    assert.ok(markup.includes(feature), `${feature} should appear in the showcase`);
  }
  assert.match(markup, /src="\.\/showcase\.js"/);
  assert.match(script, /ArrowRight/);
  assert.match(script, /data-sort/);
  assert.match(script, /data-page-step/);
  assert.match(siteStyles, /font-family:\s*"GilroyforArcelorMittal"/);
  assert.match(siteStyles, /font-family:\s*"GilroyforArcelorMittal-SmBd"/);
  assert.ok(markup.includes('font-family: "GilroyforArcelorMittal", sans-serif;'));
  assert.ok(markup.includes('font-family: "GilroyforArcelorMittal-SmBd", sans-serif;'));
  assert.ok(regularFont.length > 0);
  assert.ok(semiboldFont.length > 0);
});

test("headings use the branded semibold family while body copy uses regular", async () => {
  const [tokens, foundation] = await Promise.all([
    readCss("tokens.css"),
    readCss("foundation.css")
  ]);

  assert.match(tokens, /--am-font-family:\s*"GilroyforArcelorMittal", sans-serif/);
  assert.match(tokens, /--am-font-family-heading:\s*"GilroyforArcelorMittal-SmBd", sans-serif/);
  assert.match(foundation, /font-family:\s*var\(--am-font-family-heading\)/);
  assert.match(foundation, /font-weight:\s*400/);
});

test("brand typography scales apply to semantic headings and matching classes", async () => {
  const [tokens, foundation, utilities, components, markup] = await Promise.all([
    readCss("tokens.css"),
    readCss("foundation.css"),
    readCss("utilities.css"),
    readCss("components.css"),
    readFile(new URL("../docs/index.html", import.meta.url), "utf8")
  ]);

  for (const [name, size, lineHeight] of [
    ["h1", "4.125rem", "5.15625rem"],
    ["h2", "3.125rem", "3.90625rem"],
    ["h3", "2.3125rem", "2.6375rem"],
    ["h4", "1.75rem", "2.1875rem"],
    ["h5", "1.3125rem", "1.6375rem"]
  ]) {
    assert.ok(tokens.includes(`--am-font-size-${name}: ${size};`));
    assert.ok(tokens.includes(`--am-line-height-${name}: ${lineHeight};`));
    assert.match(foundation, new RegExp(`${name},\\s*\\.am-${name}\\s*\\{`));
  }

  for (const name of ["--am-font-size-body-1", "--am-font-size-body-2", "--am-font-size-label"]) {
    assert.ok(tokens.includes(name));
  }
  assert.match(utilities, /\.am-body-1\s*\{/);
  assert.match(utilities, /\.am-body-1--semibold\s*\{/);
  assert.match(utilities, /\.am-body-2\s*\{/);
  assert.match(components, /\.am-label\s*\{/);
  assert.ok(markup.includes('class="am-h1"'));
  assert.ok(markup.includes('class="am-h5"'));
});

test("layout spacing, action states and icon rules are documented", async () => {
  const [tokens, utilities, components, markup] = await Promise.all([
    readCss("tokens.css"),
    readCss("utilities.css"),
    readCss("components.css"),
    readFile(new URL("../docs/index.html", import.meta.url), "utf8")
  ]);

  for (const [name, value] of [
    ["2xs", "1rem"],
    ["xs", "1.5rem"],
    ["sm", "2rem"],
    ["md", "3rem"],
    ["lg", "4rem"],
    ["xl", "6rem"],
    ["xl2", "10rem"]
  ]) {
    assert.ok(tokens.includes(`--am-layout-space-${name}: ${value};`));
    assert.ok(utilities.includes(`.am-layout-gap-${name}`));
    assert.ok(utilities.includes(`.am-layout-padding-${name}`));
  }

  assert.match(tokens, /--am-action-disabled:\s*#ffd7cc/);
  assert.match(tokens, /--am-action-positive:\s*#70a489/);
  assert.match(tokens, /--am-action-alert:\s*#cc2c00/);
  assert.match(components, /background:\s*var\(--am-action-disabled\)/);
  assert.match(components, /\.am-alert--success\s*\{\s*border-inline-start-color:\s*var\(--am-action-positive\)/);
  assert.match(components, /\.am-alert--error\s*\{\s*border-inline-start-color:\s*var\(--am-action-alert\)/);
  assert.match(tokens, /--am-icon-size:\s*1\.5rem;/);
  assert.match(tokens, /--am-icon-stroke-width:\s*2;/);
  assert.match(utilities, /\.am-icon\s*\{[\s\S]*width:\s*var\(--am-icon-size\);[\s\S]*height:\s*var\(--am-icon-size\);/);
  for (const example of [
    "--am-action-disabled",
    "Action - Positive",
    "--am-action-positive",
    "Action - Alert",
    "--am-action-alert",
    "am-layout-gap-xs",
    "am-layout-padding-md",
    "viewBox=\"0 0 24 24\"",
    "Loupe"
  ]) {
    assert.ok(markup.includes(example), `${example} should appear in the showcase`);
  }
  assert.ok(!markup.includes("am-media"));
  assert.ok(!components.includes(".am-media"));
});

test("official web palette, color pairings and copyable examples are documented", async () => {
  const [tokens, utilities, components, markup, script, paletteImage, pairingsImage] = await Promise.all([
    readCss("tokens.css"),
    readCss("utilities.css"),
    readCss("components.css"),
    readFile(new URL("../docs/index.html", import.meta.url), "utf8"),
    readFile(new URL("../docs/showcase.js", import.meta.url), "utf8"),
    readFile(new URL("../docs/assets/branding/primary-colour-palette.png", import.meta.url)),
    readFile(new URL("../docs/assets/branding/primary-colour-pairs.png", import.meta.url))
  ]);

  for (const [name, value] of [
    ["--am-color-black", "#151515"],
    ["--am-color-dark-steel-grey", "#414141"],
    ["--am-color-light-grey", "#d8d8d8"],
    ["--am-color-light-blue", "#e6eaef"],
    ["--am-color-hot-orange", "#ff3700"],
    ["--am-color-sky-blue", "#0072ce"],
    ["--am-color-gradient-midnight", "#000014"],
    ["--am-color-gradient-purple", "#260c67"],
    ["--am-color-gradient-dark-pink", "#932184"],
    ["--am-color-gradient-red", "#e54749"],
    ["--am-color-gradient-orange", "#f09357"],
    ["--am-color-gradient-yellow", "#ffdf88"]
  ]) {
    assert.ok(tokens.toLowerCase().includes(`${name}: ${value};`), `${name} should use its brand value`);
    assert.ok(markup.toLowerCase().includes(value), `${value} should appear in the palette guide`);
  }

  assert.match(tokens, /--am-gradient-master:\s*linear-gradient/);
  assert.match(tokens, /--am-gradient-web:\s*linear-gradient/);
  assert.match(tokens, /--am-gradient-cta:[\s\S]*?var\(--am-gradient-web\)/);
  const webGradient = tokens.match(/--am-gradient-web:\s*linear-gradient\(([\s\S]*?)\);/)?.[1];
  assert.ok(webGradient?.includes("var(--am-color-gradient-midnight)"));
  assert.ok(webGradient?.includes("var(--am-color-gradient-orange)"));
  assert.ok(!webGradient?.includes("var(--am-color-gradient-yellow)"));
  assert.match(components, /\.am-button--icon:not\(:disabled\):hover::before/);
  assert.match(components, /\.am-breadcrumb\s*\{/);
  assert.match(components, /\.am-button--hot-orange\s*\{/);
  assert.match(components, /\.am-button--sky\s*\{/);
  assert.match(components, /\.am-badge--accent\s*\{/);
  assert.match(components, /\.am-badge--sky\s*\{/);
  assert.match(components, /\.am-table-sort\s*\{/);
  assert.match(utilities, /\.am-kicker\s*\{/);
  assert.match(utilities, /\.am-theme--sky-blue\s*\{/);
  assert.match(utilities, /\.am-theme--dark-steel-grey\s*\{/);

  assert.equal((markup.match(/data-copy-code/g) ?? []).length, 12);
  assert.ok(markup.includes("HTML du tableau"));
  assert.ok(markup.includes("Filtre et tri (JavaScript)"));
  assert.ok(markup.includes("class=\"am-table-sort\""));
  assert.match(script, /aria-sort/);
  assert.ok(markup.includes("./assets/branding/primary-colour-palette.png"));
  assert.ok(markup.includes("./assets/branding/primary-colour-pairs.png"));
  assert.deepEqual([paletteImage.readUInt32BE(16), paletteImage.readUInt32BE(20)], [800, 447]);
  assert.deepEqual([pairingsImage.readUInt32BE(16), pairingsImage.readUInt32BE(20)], [800, 750]);
  assert.ok(markup.includes("contacter l'équipe de marque à Londres"));
  assert.match(script, /navigator\.clipboard\.writeText/);
  assert.match(script, /Code copié\./);
});
