import { spawn } from 'node:child_process';

const PORT = process.env.PORT ?? '3000';
const BASE_URL = process.env.LHCI_BASE_URL ?? `http://localhost:${PORT}`;
const PRODUCT_SLUG = process.env.LHCI_PRODUCT_SLUG ?? 'example-slug';
const CONFIG = process.env.LHCI_CONFIG ?? './lighthouserc.local.json';

const urls = [`${BASE_URL}/`, `${BASE_URL}/product/${PRODUCT_SLUG}`];

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
    p.on('exit', (code) => (code === 0 ? resolve() : reject(new Error(`${cmd} exited ${code}`))));
  });
}

function startServer() {
  return spawn('npm', ['run', 'start', '--', '-p', PORT], {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, PORT },
  });
}

async function waitFor(url, timeoutMs = 45000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url, { method: 'GET' });
      if (res.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server not ready at ${url}`);
}

const server = startServer();

try {
  await waitFor(urls[0]);
  const args = ['lhci', 'autorun', `--config=${CONFIG}`];
  for (const u of urls) args.push(`--collect.url=${u}`);
  await run('npx', args);
} finally {
  server.kill('SIGTERM');
}
