import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const action = process.argv[2];

function stop(message) {
  console.error(message);
  process.exit(1);
}

if (!action || action === '--help') {
  console.log('Cloudflare Pages Direct Upload (no GitHub required)');
  console.log('  node scripts/cloudflare.mjs create  - create the Pages project once');
  console.log('  node scripts/cloudflare.mjs deploy  - publish the existing dist/ build');
  console.log('Copy .cloudflare.env.example to .cloudflare.env and read DEPLOYMENT.md first.');
  process.exit(0);
}

if (!['create', 'deploy'].includes(action) || process.argv.length > 3) {
  stop('Use "create" or "deploy". Run with --help for instructions.');
}

const [major, minor] = process.versions.node.split('.').map(Number);
if (major < 22 || (major === 22 && minor < 12)) {
  stop('Install a current Node.js 22 release (22.12 or newer) before deploying.');
}

// Deployment credentials are loaded only here, never by the browser application.
const credentialsFile = join(root, '.cloudflare.env');
if (existsSync(credentialsFile)) {
  try {
    process.loadEnvFile(credentialsFile);
  } catch {
    stop('Could not read .cloudflare.env. Check its permissions and KEY=value formatting.');
  }
}

const token = process.env.CLOUDFLARE_API_TOKEN?.trim();
const account = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
const project = process.env.CLOUDFLARE_PROJECT_NAME?.trim();

if (!token || /^(your_|paste_|replace_)/i.test(token)) {
  stop('Set CLOUDFLARE_API_TOKEN in .cloudflare.env to your Pages Edit token. Do not share it in chat.');
}
if (!account || !/^[a-f0-9]{32}$/i.test(account)) {
  stop('Set CLOUDFLARE_ACCOUNT_ID to the 32-character account ID from Workers & Pages, not a zone ID.');
}
if (!project || project.length > 58 || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(project)) {
  stop('Set CLOUDFLARE_PROJECT_NAME to 1-58 lowercase letters, numbers, or single separating hyphens.');
}
if (action === 'deploy' && !existsSync(join(root, 'dist', 'index.html'))) {
  stop('No production build found. Run npm run build first, then deploy again.');
}

// Explicit project and branch prevent Wrangler from guessing the wrong destination.
const args = action === 'create'
  ? ['pages', 'project', 'create', project, '--production-branch=main']
  : ['pages', 'deploy', 'dist', `--project-name=${project}`, '--branch=main', '--commit-dirty=true'];

console.log(`${action === 'create' ? 'Creating' : 'Deploying to'} Cloudflare Pages project: ${project}`);
const result = spawnSync('npx', ['--yes', 'wrangler@4', ...args], {
  cwd: root,
  stdio: 'inherit',
  // Windows needs a shell for npx.cmd; every command argument above is fixed or validated.
  shell: process.platform === 'win32',
  env: {
    ...process.env,
    CLOUDFLARE_API_TOKEN: token,
    CLOUDFLARE_ACCOUNT_ID: account,
    WRANGLER_SEND_METRICS: 'false',
    CI: 'true',
  },
});

if (result.error) {
  stop('Could not start Wrangler. Check that Node.js/npm are installed and your internet connection works.');
}
if (result.status !== 0) {
  stop('Cloudflare did not confirm success. Read the Wrangler error above; see DEPLOYMENT.md for help.');
}

if (action === 'create') {
  console.log('Project created. Build the app, then run: node scripts/cloudflare.mjs deploy');
} else {
  console.log('Upload completed. Open the URL printed by Wrangler and test leaving and receiving a note.');
}