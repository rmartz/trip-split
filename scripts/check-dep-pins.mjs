#!/usr/bin/env node
// Enforce the Dependencies rule in AGENTS.md: every package.json pin must
// specify a full major.minor.patch base (operator preserved). An abbreviated
// pin like "^3" hides Dependabot bumps — a minor/patch update satisfying it
// changes only pnpm-lock.yaml, so a behavior-affecting bump (e.g. a Prettier
// reformat) can slip through review. A full base like "^3.8.3" forces every
// bump to update package.json too.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const SECTIONS = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];

// Non-registry specifiers are not semver ranges — skip them.
const NON_REGISTRY =
  /^(workspace:|catalog:|link:|file:|git\+|github:|git:|https?:|npm:)/;

// A compliant range: optional ^ or ~, then major.minor.patch, with an optional
// prerelease/build suffix (e.g. ^1.2.3, ~4.5.6-beta.1, 7.8.9).
const FULL_PIN =
  /^[\^~]?\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;

const violations = [];
for (const section of SECTIONS) {
  const deps = pkg[section];
  if (!deps) continue;
  for (const [name, range] of Object.entries(deps)) {
    if (typeof range !== "string") continue;
    if (NON_REGISTRY.test(range) || range.includes("/")) continue;
    if (!FULL_PIN.test(range)) {
      violations.push(`${section} / ${name} / "${range}"`);
    }
  }
}

if (violations.length > 0) {
  console.error(
    "package.json pins must specify a full major.minor.patch version " +
      "(operator preserved). Offending pins:",
  );
  for (const v of violations) console.error(`  ✗ ${v}`);
  console.error(
    "\nPin each to the version currently resolved in pnpm-lock.yaml " +
      "(see AGENTS.md > Dependencies).",
  );
  process.exit(1);
}

console.log("OK — all package.json pins use a full major.minor.patch version.");
