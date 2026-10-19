#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const wizard = readFileSync(join(root, 'js/wizard.js'), 'utf8');

const forbidden = [
  "querySelectorAll('[data-lang]')",
  'querySelectorAll("[data-lang]")',
  'querySelectorAll(`[data-lang]`)',
  "querySelectorAll('[data-lang]",
  'dataset.lang',
  'data-lang="',
  "data-lang='",
  'data-lang=`',
];

let failed = 0;
for (const needle of forbidden) {
  if (wizard.includes(needle)) {
    console.error(`FAIL wizard.js must not touch site i18n via ${needle}`);
    failed += 1;
  }
}

if (!wizard.includes('data-prompt-lang')) {
  console.error('FAIL wizard.js must use data-prompt-lang for prompt language chips');
  failed += 1;
}

if (!wizard.includes("this.container.querySelectorAll('[data-prompt-lang]')")) {
  console.error('FAIL wizard language listeners must be scoped to this.container [data-prompt-lang]');
  failed += 1;
}

if (failed) {
  console.error(`\n${failed} wizard language check(s) failed`);
  process.exit(1);
}
console.log('OK wizard language isolated from site i18n');
