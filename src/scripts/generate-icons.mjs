import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const iconsDir = path.join(__dirname, '../icons');
const iconstOutput = path.join(__dirname, '../design-tokens/icons.ts');
const files = fs.readdirSync(iconsDir);
const icons = [];

files.map((file) => {
  icons.push(path.basename(file, '.svg'));
});

const contents = `export const icons = ${JSON.stringify(icons)} as const;
export type IconName = (typeof icons)[number];
`;

fs.writeFileSync(iconstOutput, contents);
