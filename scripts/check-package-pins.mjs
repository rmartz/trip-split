#!/usr/bin/env node
/**
 * Enforces that every registry dependency in every package.json specifies a
 * full [major].[minor].[patch] base version (the `^`/`~` operator is kept).
 *
 * A bare-major range like "^3" hides which version is actually installed, so a
 * lock-only Dependabot bump can silently change behavior with no package.json
 * diff (see #114, where a "^3" prettier pin reformatted the codebase via a
 * pnpm-lock.yaml-only update). Requiring a full base makes every bump show up
 * as an explicit, reviewable package.json change.
 *
 * For each dependency the rule is: strip a single leading `^` or `~`, then the
 * remainder must match \d+\.\d+\.\d+ (optionally with a -prerelease / +build
 * suffix). Non-registry specifiers (workspace:, catalog:, link:, file:, npm:
 * aliases, git/github/URL deps) are skipped — they don't resolve from the
 * registry by version range.
 *
 * Exits 0 if all pins are compliant, 1 if any violations are found.
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname, relative } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

// Directories that never hold first-party manifests we control.
const IGNORED_DIRS = new Set([
  "node_modules",
  ".git",
  ".git-worktrees",
  ".next",
  "dist",
  "storybook-static",
]);

// Dependency sections to enforce. peerDependencies are intentionally excluded:
// they legitimately use open ranges (e.g. "*") to express compatibility.
const SECTIONS = ["dependencies", "devDependencies", "optionalDependencies"];

// A specifier that does not resolve from the registry by semver range.
const NON_REGISTRY =
  /^(workspace:|catalog:|link:|file:|portal:|npm:|git\+|git:|github:|https?:)/;

// Full base after stripping an optional ^ or ~: major.minor.patch (+suffix).
const FULL_BASE = /^[\^~]?\d+\.\d+\.\d+([-+].+)?$/;

function findManifests(dir) {
  const found = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORED_DIRS.has(entry.name)) {
        found.push(...findManifests(join(dir, entry.name)));
      }
    } else if (entry.name === "package.json") {
      found.push(join(dir, entry.name));
    }
  }
  return found;
}

function isNonRegistry(range) {
  // Catch protocol-prefixed specifiers plus github "owner/repo" shorthand and
  // any URL — none of which a plain semver range ever contains.
  return (
    NON_REGISTRY.test(range) || range.includes("/") || range.includes("://")
  );
}

function checkManifest(manifestPath) {
  const pkg = JSON.parse(readFileSync(manifestPath, "utf8"));
  const rel = relative(root, manifestPath) || "package.json";
  const violations = [];
  for (const section of SECTIONS) {
    const deps = pkg[section];
    if (!deps) continue;
    for (const [name, range] of Object.entries(deps)) {
      if (typeof range !== "string" || isNonRegistry(range)) continue;
      if (!FULL_BASE.test(range)) {
        violations.push(`  ${rel}  ${name}  "${range}"`);
      }
    }
  }
  return violations;
}

const manifests = findManifests(root);
const violations = manifests.flatMap(checkManifest);

if (violations.length > 0) {
  console.error(
    `Found ${violations.length} dependency pin(s) without a full [major].[minor].[patch] base:\n`,
  );
  for (const v of violations) console.error(v);
  console.error(
    "\nExpand each range to its full installed version (keep the ^/~ operator), " +
      'e.g. "^3" -> "^3.9.4". Read the installed version from pnpm-lock.yaml.',
  );
  process.exit(1);
}

console.log(
  `All dependency pins specify a full version (${manifests.length} package.json checked).`,
);
