#!/usr/bin/env node
/**
 * Applies customer dark-theme class replacements across customer pages.
 * Run: node scripts/migrate-customer-dark.mjs
 */

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const FILES = [
  "app/customer/active-rides/page.tsx",
  "app/customer/account/page.tsx",
  "app/customer/billing/page.tsx",
  "app/customer/quotes/page.tsx",
  "app/customer/support/page.tsx",
  "app/customer/history/page.tsx",
  "app/customer/ride/[id]/page.tsx",
];

const IMPORT_LINE =
  'import { customerTones } from "@/components/customer/customer-tones";';

const REPLACEMENTS = [
  ['min-h-full bg-[#f6f8fc]', '{customerTones.page}'],
  ['className="min-h-full bg-background"', "className={customerTones.page}"],
  ["bg-blue-50 text-blue-700", "{customerTones.icon.blue}"],
  ["bg-emerald-50 text-emerald-700", "{customerTones.icon.emerald}"],
  ["bg-orange-50 text-orange-700", "{customerTones.icon.orange}"],
  ["bg-violet-50 text-violet-700", "{customerTones.icon.violet}"],
  ["bg-red-50 text-red-700", "{customerTones.icon.red}"],
  [
    'className="mb-4 bg-blue-50 px-3 py-1.5 text-blue-700 hover:bg-blue-50"',
    'className={`mb-4 px-3 py-1.5 ${customerTones.badge.info}`}',
  ],
  [
    'className="mb-4 bg-emerald-100 px-3 py-1.5 text-emerald-700 hover:bg-emerald-100"',
    'className={`mb-4 px-3 py-1.5 ${customerTones.badge.success}`}',
  ],
  [
    'className="w-fit bg-foreground px-3 py-2 text-white hover:bg-foreground"',
    'className={`w-fit px-3 py-2 ${customerTones.statusPill}`}',
  ],
  [
    'className="mb-3 bg-foreground text-white"',
    'className={`mb-3 ${customerTones.statusPill}`}',
  ],
  [
    'border-blue-200 text-blue-700 hover:bg-blue-50',
    '{customerTones.outlineAction}',
  ],
  [
    'border-blue-300 text-blue-700 hover:bg-blue-50',
    '{customerTones.outlineAction}',
  ],
  [
    'className="border-emerald-200 bg-emerald-50 p-6 shadow-sm"',
    'className={`border-emerald-200 p-6 shadow-sm ${customerTones.surface.success}`}',
  ],
  [
    'className="border-emerald-200 bg-emerald-50 p-7 shadow-sm"',
    'className={`border-emerald-200 p-7 shadow-sm ${customerTones.surface.success}`}',
  ],
  [
    'className="border-red-200 bg-red-50 p-7 shadow-sm"',
    'className={`border-red-200 p-7 shadow-sm ${customerTones.surface.danger}`}',
  ],
  [
    'className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900"',
    'className={customerTones.surface.info}',
  ],
  [
    'className="mx-6 mb-6 grid gap-4 rounded-lg bg-blue-50 p-5 md:grid-cols-2"',
    'className={`mx-6 mb-6 ${customerTones.surface.infoBlock}`}',
  ],
  [
    'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
    '{customerTones.badge.success}',
  ],
  [
    'bg-blue-100 text-blue-700 hover:bg-blue-100',
    '{customerTones.badge.info}',
  ],
  [
    'bg-amber-100 text-amber-700 hover:bg-amber-100',
    '{customerTones.badge.pending}',
  ],
  [
    'bg-blue-600 text-white hover:bg-blue-600',
    '{customerTones.badge.infoSolid}',
  ],
  [
    'className="w-fit bg-teal-100 text-teal-800 hover:bg-teal-100"',
    'className={`w-fit ${customerTones.badge.status}`}',
  ],
  [
    'className="mt-4 rounded-lg bg-foreground p-4 text-white"',
    'className={`mt-4 rounded-lg p-4 ${customerTones.statusPill}`}',
  ],
  [
    'className="text-blue-700"',
    'className={customerTones.link}',
  ],
  [
    'className="h-auto px-0 text-blue-700"',
    'className={`h-auto px-0 ${customerTones.link}`}',
  ],
  [
    'className="mt-3 h-auto px-0 text-blue-700"',
    'className={`mt-3 h-auto px-0 ${customerTones.link}`}',
  ],
  [
    'className="mt-4 h-auto px-0 text-blue-700"',
    'className={`mt-4 h-auto px-0 ${customerTones.link}`}',
  ],
  [
    'className="mt-5 w-full text-blue-700"',
    'className={`mt-5 w-full ${customerTones.link}`}',
  ],
  [
    'className="mt-3 w-full text-blue-700"',
    'className={`mt-3 w-full ${customerTones.link}`}',
  ],
  [
    'border-blue-200 text-blue-700 hover:bg-blue-50',
    '{customerTones.outlineAction}',
  ],
];

function wrapClassName(content) {
  // Fix patterns like className="...{customerTones.icon.blue}..."
  return content.replace(
    /className="([^"]*\{customerTones[^"]*)"/g,
    'className={`$1`}',
  );
}

function ensureImport(content) {
  if (content.includes("customer-tones")) return content;
  const lines = content.split("\n");
  const lastImport = lines.findLastIndex((line) => line.startsWith("import "));
  if (lastImport === -1) return content;
  lines.splice(lastImport + 1, 0, IMPORT_LINE);
  return lines.join("\n");
}

async function main() {
  for (const rel of FILES) {
    const file = path.join(root, rel);
    let content = await readFile(file, "utf8");
    const before = content;

    for (const [from, to] of REPLACEMENTS) {
      content = content.split(from).join(to);
    }
    content = wrapClassName(content);
    content = ensureImport(content);

    if (content !== before) {
      await writeFile(file, content, "utf8");
      console.log("updated", rel);
    }
  }
}

main();
