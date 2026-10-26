import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createConnection } from 'node:net';

const root = fileURLToPath(new URL('../', import.meta.url));
const backend = resolve(root, 'Backend');
const children = [];

function portIsOpen(port) {
  return new Promise((resolveCheck) => {
    const socket = createConnection({ host: '127.0.0.1', port });
    socket.setTimeout(500);
    socket.once('connect', () => { socket.destroy(); resolveCheck(true); });
    socket.once('error', () => resolveCheck(false));
    socket.once('timeout', () => { socket.destroy(); resolveCheck(false); });
  });
}

async function waitForPort(port, timeoutMs = 20000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await portIsOpen(port)) return true;
    await new Promise((resolveWait) => setTimeout(resolveWait, 500));
  }
  return false;
}

async function ensureLocalDatabase() {
  if (process.platform !== 'win32' || !process.env.LOCALAPPDATA) return;

  const pgCtl = process.env.HAILANG_PG_CTL || 'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_ctl.exe';
  const dataDir = join(process.env.LOCALAPPDATA, 'HAILANG', 'PostgreSQL', 'data');
  const port = 5433;
  if (!existsSync(pgCtl) || !existsSync(dataDir)) return;
  if (await portIsOpen(port)) return;

  const status = spawnSync(pgCtl, ['-D', dataDir, 'status'], { stdio: 'ignore' });
  if (status.status !== 0) {
    const logPath = join(process.env.LOCALAPPDATA, 'HAILANG', 'PostgreSQL', 'postgres.log');
    const started = spawnSync(pgCtl, ['-D', dataDir, '-l', logPath, '-o', `-p ${port} -h 127.0.0.1`, 'start'], { stdio: 'inherit' });
    if (started.status !== 0) {
      console.error('Could not start the local PostgreSQL database. Check the PostgreSQL log at:', logPath);
      return;
    }
  }

  if (await waitForPort(port)) console.log(`Local PostgreSQL is ready on port ${port}.`);
  else console.error(`PostgreSQL did not become ready on port ${port}; backend database requests may fail.`);
}

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

await ensureLocalDatabase();
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
