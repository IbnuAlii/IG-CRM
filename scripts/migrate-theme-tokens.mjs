#!/usr/bin/env node
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const TARGET_DIRS = [
  "app/customer",
  "app/driver",
  "app/manager",
  "app/accountant",
  "components/customer",
  "components/driver",
  "components/manager",
  "components/accountant",
];

const REPLACEMENTS = [
  ["text-slate-950", "text-foreground"],
  ["text-slate-900", "text-foreground"],
  ["text-slate-800", "text-foreground"],
  ["text-slate-700", "text-foreground"],
  ["text-slate-600", "text-muted-foreground"],
  ["text-slate-500", "text-muted-foreground"],
  ["text-slate-400", "text-muted-foreground"],
  ["border-slate-300", "border-border"],
  ["border-slate-200/80", "border-border/80"],
  ["border-slate-200", "border-border"],
  ["bg-slate-100", "bg-muted"],
  ["bg-slate-50", "bg-muted"],
  ["bg-white/95", "bg-background/95"],
  ["bg-white/90", "bg-background/90"],
  ["bg-white", "bg-card"],
  ["divide-slate-200", "divide-border"],
  ["shadow-slate-200/70", "shadow-border/40"],
  ["shadow-slate-200", "shadow-border"],
  ["bg-slate-200", "bg-border"],
  ["text-slate-300", "text-muted-foreground"],
  ["text-slate-200", "text-muted-foreground"],
  ["from-slate-950", "from-foreground"],
  ["to-slate-950", "to-foreground"],
  ["bg-slate-950", "bg-foreground"],
  ["hover:bg-slate-950", "hover:bg-foreground"],
];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (/\.(tsx|ts|jsx|js)$/.test(e.name)) files.push(full);
  }
  return files;
}

async function main() {
  let changed = 0;
  for (const rel of TARGET_DIRS) {
    const dir = path.join(root, rel);
    try {
      const files = await walk(dir);
      for (const file of files) {
        let content = await readFile(file, "utf8");
        const before = content;
        for (const [from, to] of REPLACEMENTS) {
          content = content.split(from).join(to);
        }
        if (content !== before) {
          await writeFile(file, content, "utf8");
          changed++;
          console.log("updated", path.relative(root, file));
        }
      }
    } catch (err) {
      if (err.code !== "ENOENT") throw err;
    }
  }
  // Portal layouts
  for (const layout of ["app/customer/layout.tsx", "app/driver/layout.tsx"]) {
    const file = path.join(root, layout);
    let content = await readFile(file, "utf8");
    const before = content;
    for (const [from, to] of REPLACEMENTS) {
      content = content.split(from).join(to);
    }
    if (content !== before) {
      await writeFile(file, content, "utf8");
      changed++;
      console.log("updated", layout);
    }
  }
  console.log(`Done. ${changed} files updated.`);
}

main();
