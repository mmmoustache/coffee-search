import { readFile } from 'node:fs/promises';
import { promisify } from 'node:util';
import { brotliCompress, gzip as gzipCb } from 'node:zlib';
import { glob } from 'glob';

const gzip = promisify(gzipCb);
const brotli = promisify(brotliCompress);

const MAX_TOTAL_BROTLI_KB = Number(process.env.BUDGET_TOTAL_KB ?? 350);
const MAX_SINGLE_BROTLI_KB = Number(process.env.BUDGET_SINGLE_KB ?? 180);

const files = await glob('.next/static/chunks/**/*.js', { nodir: true });

if (!files.length) {
  console.error('No chunk files found. Did you run `next build`?');
  process.exit(1);
}

let total = 0;
const rows = [];

for (const file of files) {
  const buf = await readFile(file);
  const [gz, br] = await Promise.all([gzip(buf), brotli(buf)]);
  const brKb = br.length / 1024;
  total += brKb;
  rows.push({ file, brKb, gzKb: gz.length / 1024 });
}

rows.sort((a, b) => b.brKb - a.brKb);

const biggest = rows[0];
const totalKb = total;

console.log(`Total chunks (brotli): ${totalKb.toFixed(1)} KB`);
console.log(`Biggest chunk (brotli): ${biggest.brKb.toFixed(1)} KB  ${biggest.file}`);

let fail = false;

if (totalKb > MAX_TOTAL_BROTLI_KB) {
  console.error(`❌ Total budget exceeded: ${totalKb.toFixed(1)} > ${MAX_TOTAL_BROTLI_KB} KB`);
  fail = true;
}
if (biggest.brKb > MAX_SINGLE_BROTLI_KB) {
  console.error(
    `❌ Single-chunk budget exceeded: ${biggest.brKb.toFixed(1)} > ${MAX_SINGLE_BROTLI_KB} KB`
  );
  fail = true;
}

if (fail) {
  console.log('\nTop 10 chunks:');
  for (const r of rows.slice(0, 10)) {
    console.log(`- ${r.brKb.toFixed(1)} KB br | ${r.gzKb.toFixed(1)} KB gz | ${r.file}`);
  }
  process.exit(1);
}

console.log('✅ Bundle budgets OK');
