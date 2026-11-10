// Tests for the ownership guard. The temp-repo test is the one that matters: it builds a
// real git history and proves the guard fails a branch that left its files and reads
// tickets from the base, so editing your own ticket cannot widen your scope.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { check, judge, matchesPattern, parseTicket } from "./agent-guard.mjs";

test("globs: ** crosses folders, * stays in one, trailing slash means the tree", () => {
  assert.ok(matchesPattern("docs/redesign/a/b.html", "docs/redesign/"));
  assert.ok(matchesPattern("apps/web/src/x.ts", "apps/**"));
  assert.ok(matchesPattern("AGENTS.md", "AGENTS.md"));
  assert.ok(!matchesPattern("lib/a/b.dart", "lib/*"));
  assert.ok(matchesPattern("lib/a.dart", "lib/*"));
  assert.ok(!matchesPattern("docs/redesignX/a", "docs/redesign/"));
});

const TICKET = `# 01. Demo

- **Branch from:** main
- **Work branch:** \`feature/demo\` (note)
- **Owned files:** \`docs/redesign/\`,
  \`README.md\`
- **Do not touch:** \`apps/**\`, \`docs/redesign/secret.md\`
- **Done when:** x
`;

test("parses labels, multi-line lists and the work branch", () => {
  const t = parseTicket("t.md", TICKET);
  assert.equal(t.workBranch, "feature/demo");
  assert.deepEqual(t.owned, ["docs/redesign/", "README.md"]);
  assert.deepEqual(t.forbidden, ["apps/**", "docs/redesign/secret.md"]);
});

test("do-not-touch wins over owned; unlisted files are outside", () => {
  const t = parseTicket("t.md", TICKET);
  const v = judge(["docs/redesign/a.html", "docs/redesign/secret.md", "apps/web/x.ts", "other.txt"], [t]);
  assert.deepEqual(v.map((x) => x.file), ["docs/redesign/secret.md", "apps/web/x.ts", "other.txt"]);
});

function repoWithTicket() {
  const dir = mkdtempSync(join(tmpdir(), "guard-"));
  const run = (...a) => execFileSync("git", a, { cwd: dir, encoding: "utf8" });
  run("init", "-q", "-b", "main");
  run("config", "user.email", "t@t");
  run("config", "user.name", "t");
  mkdirSync(join(dir, "docs/trabajo/demo/tickets"), { recursive: true });
  writeFileSync(join(dir, "docs/trabajo/demo/tickets/01-x.md"), TICKET);
  writeFileSync(join(dir, "README.md"), "a\n");
  run("add", "-A");
  run("commit", "-q", "-m", "base");
  run("checkout", "-q", "-b", "feature/demo");
  return { dir, run };
}

test("a branch that stays inside its ticket passes", () => {
  const { dir, run } = repoWithTicket();
  mkdirSync(join(dir, "docs/redesign"), { recursive: true });
  writeFileSync(join(dir, "docs/redesign/a.html"), "x");
  run("add", "-A");
  run("commit", "-q", "-m", "ok");
  const r = check({ root: dir, base: "main", only: "feature/demo" });
  assert.equal(r.code, 0);
  assert.equal(r.results[0].judged, true);
});

test("a branch that leaves its files fails, even uncommitted", () => {
  const { dir } = repoWithTicket();
  mkdirSync(join(dir, "apps"), { recursive: true });
  writeFileSync(join(dir, "apps/leak.ts"), "x");
  const r = check({ root: dir, base: "main", only: "feature/demo" });
  assert.equal(r.code, 1);
  assert.match(r.results[0].violations[0].reason, /Do not touch/);
});

test("editing your own ticket on the branch does not widen scope (tickets come from base)", () => {
  const { dir, run } = repoWithTicket();
  writeFileSync(join(dir, "docs/trabajo/demo/tickets/01-x.md"), TICKET.replace("`apps/**`, ", "").replace("`README.md`", "`**`"));
  mkdirSync(join(dir, "apps"), { recursive: true });
  writeFileSync(join(dir, "apps/leak.ts"), "x");
  run("add", "-A");
  run("commit", "-q", "-m", "widen");
  assert.equal(check({ root: dir, base: "main", only: "feature/demo" }).code, 1);
});

test("a missing base is exit 2 and judges nothing", () => {
  const { dir } = repoWithTicket();
  assert.equal(check({ root: dir, base: "origin/main" }).code, 2);
});

test("a branch with no ticket is not judged unless a ticket is required", () => {
  const { dir, run } = repoWithTicket();
  run("checkout", "-q", "-b", "feature/other");
  writeFileSync(join(dir, "x.txt"), "x");
  run("add", "-A");
  run("commit", "-q", "-m", "x");
  assert.equal(check({ root: dir, base: "main", only: "feature/other" }).code, 0);
  assert.equal(check({ root: dir, base: "main", only: "feature/other", requireTicket: true }).code, 1);
});

test("Spanish labels read the same as the English ones", () => {
  const ticket = parseTicket("docs/trabajo/x/tickets/01-demo.md", `# 01. Demo

- **Rama de salida:** main
- **Rama de trabajo:** \`feature/demo\`
- **Ficheros en propiedad:** \`docs/a.md\`,
  \`src/\`
- **No tocar:** \`AGENTS.md\`
- **Terminado cuando:** pasan las pruebas
`);
  assert.equal(ticket.workBranch, "feature/demo");
  assert.deepEqual(ticket.owned, ["docs/a.md", "src/"]);
  assert.deepEqual(ticket.forbidden, ["AGENTS.md"]);
});

test("plain Spanish headers (no bold, no bullet) are read like the bold ones", () => {
  const plain = [
    "# Brújula: ficha de pensiones",
    "",
    "Rama de trabajo: `feature/ficha-pensiones`",
    "Terminado cuando: la ficha pasa node --check.",
    "",
    "Ficheros en propiedad:",
    "- `data/fichas.js`",
    "- `tickets/ficha-pensiones.md`",
    "No tocar: `recogida/`",
  ].join("\n");
  const t = parseTicket("tickets/ficha-pensiones.md", plain);
  assert.equal(t.workBranch, "feature/ficha-pensiones");
  assert.deepEqual(t.owned, ["data/fichas.js", "tickets/ficha-pensiones.md"]);
  assert.deepEqual(t.forbidden, ["recogida/"]);
});

test("a ticket without a work branch declares no branch (it judges nobody)", () => {
  const t = parseTicket("tickets/x.md", "# X\n\nFicheros en propiedad:\n- `a.js`\n");
  assert.equal(t.workBranch, "");
});

test("tickets in a top-level tickets/ folder are found, read from the base", () => {
  const dir = mkdtempSync(join(tmpdir(), "guard-top-"));
  const g = (...a) => execFileSync("git", a, { cwd: dir, encoding: "utf8" });
  g("init", "-q", "-b", "main");
  g("config", "user.email", "t@t.t");
  g("config", "user.name", "t");
  mkdirSync(join(dir, "tickets"));
  mkdirSync(join(dir, "data"));
  writeFileSync(join(dir, "tickets", "a.md"),
    "# A\n\nRama de trabajo: `feature/a`\nFicheros en propiedad:\n- `data/a.js`\n");
  g("add", "."); g("commit", "-qm", "base");
  g("checkout", "-qb", "feature/a");
  writeFileSync(join(dir, "data", "a.js"), "1");
  writeFileSync(join(dir, "intruso.txt"), "x");
  g("add", "."); g("commit", "-qm", "work");
  const r = check({ root: dir, base: "main", only: "feature/a" });
  assert.equal(r.code, 1);
  assert.deepEqual(r.results[0].violations.map((v) => v.file), ["intruso.txt"]);
});
