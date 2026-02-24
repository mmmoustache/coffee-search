import { spawn } from 'node:child_process';

const PORT = process.env.PORT ?? '3000';
const URL = process.env.LHCI_URL ?? `http://localhost:${PORT}`;
const CONFIG = process.env.LHCI_CONFIG ?? './lighthouserc.local.json';

function run(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true, ...opts });
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
  throw new Error(`Server not ready at ${url} after ${timeoutMs}ms`);
}

const server = startServer();

try {
  await waitFor(URL);
  await run('npx', ['lhci', 'autorun', `--config=${CONFIG}`, `--collect.url=${URL}`]);
} finally {
  server.kill('SIGTERM');
}
