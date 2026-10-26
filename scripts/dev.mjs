import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const backend = resolve(root, 'Backend');
const children = [];

async function backendIsHealthy() {
  try {
    const response = await fetch('http://127.0.0.1:5000/health', { signal: AbortSignal.timeout(1000) });
    if (!response.ok) return false;
    const health = await response.json();
    return health.status === 'ok';
  } catch {
    return false;
  }
}

function start(label, args, cwd) {
  const child = spawn(process.execPath, args, { cwd, stdio: 'inherit' });
  children.push(child);
  child.on('error', (error) => console.error(`${label} failed to start:`, error.message));
  child.on('exit', (code) => {
    if (code !== 0 && code !== null) console.error(`${label} stopped with exit code ${code}`);
  });
}

start('Frontend', [resolve(root, 'node_modules/vite/bin/vite.js')], root);

if (await backendIsHealthy()) {
  console.log('HAILANG backend is healthy on port 5000; using the running instance.');
} else {
  const tsx = resolve(backend, 'node_modules/tsx/dist/cli.mjs');
  if (!existsSync(tsx)) {
    console.error('Backend dependencies are missing. Run npm.cmd install in Backend first.');
    process.exitCode = 1;
  } else {
    start('Backend', [tsx, 'watch', 'src/index.ts'], backend);
  }
}

function stop() {
  for (const child of children) if (child.exitCode === null) child.kill();
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
