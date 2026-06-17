#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "app/customer/account/page.tsx",
  "app/customer/billing/page.tsx",
  "app/customer/quotes/page.tsx",
  "app/customer/support/page.tsx",
  "app/customer/history/page.tsx",
  "app/customer/ride/[id]/page.tsx",
  "app/customer/active-rides/page.tsx",
];

function fix(content) {
  content = content.replace(
    /className=\{\`\{customerTones\.([^`]+)\}\`\}/g,
    "className={customerTones.$1}",
  );
  content = content.replace(/"\{customerTones\.([^"]+)\}"/g, "customerTones.$1");
  content = content.replace(
    /className=\{\`([^`]*?)\{customerTones/g,
    "className={`$1${customerTones",
  );
  content = content.replace(
    /className=\{compact \? "([^"]*\{customerTones[^"]*)" : "([^"]*\{customerTones[^"]*)"\}/g,
    'className={compact ? `$1`.replace("{customerTones", "${customerTones") : `$2`}',
  );
  // compact ternary fix manually
  content = content.replace(
    'className={compact ? "grid h-10 w-10 place-items-center rounded-lg {customerTones.icon.blue}" : "grid h-14 w-14 place-items-center rounded-lg {customerTones.icon.blue}"}',
    "className={compact ? `grid h-10 w-10 place-items-center rounded-lg ${customerTones.icon.blue}` : `grid h-14 w-14 place-items-center rounded-lg ${customerTones.icon.blue}`}",
  );
  return content;
}

async function main() {
  for (const rel of FILES) {
    const file = path.join(root, rel);
    let content = await readFile(file, "utf8");
    const fixed = fix(content);
    if (fixed !== content) {
      await writeFile(file, fixed, "utf8");
      console.log("fixed", rel);
    }
  }
}

main();
