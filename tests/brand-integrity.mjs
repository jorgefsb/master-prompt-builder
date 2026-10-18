#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

const packs = [
  join(root, 'brand/0.3/manifest.json'),
  join(root, 'juice/1.0.0/manifest.json'),
];

function sha256(buf) {
  return createHash('sha256').update(buf).digest('hex');
}

let failed = 0;
for (const manifestPath of packs) {
  if (!existsSync(manifestPath)) {
    console.error(`FAIL missing manifest: ${manifestPath}`);
    failed += 1;
    continue;
  }
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const dir = dirname(manifestPath);
  if (!manifest.version || !manifest.source || !Array.isArray(manifest.files)) {
    console.error(`FAIL ${manifestPath}: need version, source, files[]`);
    failed += 1;
    continue;
  }
  for (const file of manifest.files) {
    const filePath = join(dir, file.path);
    if (!file.source || !file.version || !file.sha256) {
      console.error(`FAIL ${file.path}: need source, version, sha256`);
      failed += 1;
      continue;
    }
    if (!existsSync(filePath)) {
      console.error(`FAIL missing file: ${filePath}`);
      failed += 1;
      continue;
    }
    const actual = sha256(readFileSync(filePath));
    if (actual !== file.sha256) {
      console.error(`FAIL sha256 mismatch for ${file.path}`);
      console.error(`  expected ${file.sha256}`);
      console.error(`  actual   ${actual}`);
      failed += 1;
    } else {
      console.log(`OK ${file.path} ${actual}`);
    }
  }
}

if (failed) {
  console.error(`\n${failed} check(s) failed`);
  process.exit(1);
}
console.log('\nbrand integrity OK');
