// The r1-01 PR gate: validate the site that actually SHIPS.
//
// Merging to main publishes the live site (pages.yml deploys apps/app/dist
// straight to GitHub Pages - there is no staging and no build step in the
// deploy). So a broken dist merged is a broken page on the r1, immediately.
// This gate is the only thing between a bad edit and that.
//
// Dependency-free (node:fs + node:child_process).
//
// What ships vs what does not, because it is confusing and matters here:
//   apps/app/dist/   HAND-WRITTEN, no bundler. THIS is what Pages publishes.
//                    dist/main.js says so itself: "the no-bundler version:
//                    assets are referenced by relative path so it loads in a
//                    plain webview with NO build".
//   apps/app/src/    a separate vite path (apps/app/package.json has vite and a
//                    build script). It is NOT what deploys. dist/main.js and
//                    src/main.js are different files, maintained by hand.
// Both are syntax-checked below - a broken src is still a bug - but only dist
// is checked for shippability, because only dist ships.

import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "apps/app/dist";
let failures = 0;
const fail = (m) => {
  console.log(`::error::${m}`);
  failures += 1;
};

// ---------------------------------------------------------- 1. syntax
// A syntax error in dist/main.js is a blank crystal ball on the device. The
// browser throws at runtime; nothing here would fail without this check.
function jsFiles(dir) {
  const out = [];
  const walk = (d) => {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      if (e === "node_modules") continue;
      if (statSync(p).isDirectory()) walk(p);
      else if (e.endsWith(".js")) out.push(p);
    }
  };
  if (existsSync(dir)) walk(dir);
  return out;
}

const js = jsFiles("apps");
if (js.length === 0) fail("no JavaScript found under apps/ - expected at least dist/main.js");
for (const f of js) {
  try {
    execSync(`node --check "${f}"`, { stdio: "pipe" });
  } catch (e) {
    const msg = (e.stderr?.toString() || e.message).split("\n").slice(0, 3).join(" ");
    fail(`${f}: JavaScript does not parse - ${msg}`);
  }
}
console.log(`syntax: node --check passed on ${js.length} JS file(s)`);

// ---------------------------------------------------- 2. the deploy path
// pages.yml publishes `path: apps/app/dist`. If that moves or empties, Pages
// deploys nothing (or worse, an empty site) without failing.
const PAGES_WF = ".github/workflows/pages.yml";
if (!existsSync(PAGES_WF)) {
  fail(`${PAGES_WF} is missing - that workflow IS the deploy`);
} else {
  const wf = readFileSync(PAGES_WF, "utf8");
  const m = wf.match(/path:\s*(\S+)/);
  if (!m) {
    fail(`${PAGES_WF}: could not find the upload-pages-artifact path`);
  } else if (m[1] !== DIST) {
    fail(
      `${PAGES_WF} publishes '${m[1]}' but this gate validates '${DIST}'.` +
        ` One of them moved - the gate would be checking a directory that does` +
        ` not ship.`,
    );
  } else {
    console.log(`deploy: pages.yml publishes ${DIST} (matches what this gate validates)`);
  }
}

for (const required of [`${DIST}/index.html`, `${DIST}/main.js`, `${DIST}/style.css`]) {
  if (!existsSync(required)) fail(`${required} is missing - the published site needs it`);
}

// ------------------------------------------- 3. references that must resolve
// A missing asset is a dead oracle: no error, just a broken image on the r1.
function localRefs(text) {
  const out = [];
  for (const m of text.matchAll(/(?:src|href)\s*=\s*"([^"]+)"/g)) out.push(m[1]);
  // NOTE the optional './'. main.js writes them as './assets/0rac1e.png'.
  // Without that, this matched ZERO of the 31 oracle assets while still
  // printing a cheerful "references resolve" - a check that asserts nothing.
  for (const m of text.matchAll(/["'`](\.\/)?(assets\/[^"'`]+)["'`]/g)) out.push(m[2]);
  return out
    .map((r) => r.trim())
    .filter(Boolean)
    .filter((r) => !/^(https?:|mailto:|data:|#|\/\/)/i.test(r))
    .map((r) => r.split(/[?#]/)[0])
    .filter(Boolean);
}

let checked = 0;
for (const file of [`${DIST}/index.html`, `${DIST}/main.js`]) {
  if (!existsSync(file)) continue;
  const seen = new Set(localRefs(readFileSync(file, "utf8")));
  for (const r of seen) {
    checked += 1;
    const target = join(DIST, decodeURIComponent(r.replace(/^\.\//, "")));
    if (!existsSync(target)) {
      fail(`${file}: reference does not resolve -> ${r} (expected ${target})`);
    }
  }
}
console.log(`references: ${checked} local reference(s) in the shipped site resolve`);

const assetsDir = `${DIST}/assets`;
if (!existsSync(assetsDir) || readdirSync(assetsDir).length === 0) {
  fail(`${assetsDir} is missing or empty - the oracle carousel has no images`);
} else {
  console.log(`assets: ${readdirSync(assetsDir).length} file(s) present in ${assetsDir}`);
}

if (failures) {
  console.log(`\nFAILED: ${failures} problem(s). This would have shipped to the live page.`);
  process.exit(1);
}
console.log("\nOK: the shipped site parses, deploys from the right path, and resolves.");
