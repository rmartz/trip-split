#!/usr/bin/env bash
# Deploys all public environment variables from deployment/{env}.yml to Vercel.
#
# Usage:
#   scripts/deploy-config.sh --env=staging
#   scripts/deploy-config.sh --env=production
#
# Reads the current values from the deployment YAML file and upserts them to
# Vercel via the REST API. Empty values are skipped.
#
# Requires: node, vercel CLI (installed as a devDependency; run via pnpm exec vercel login)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
DEPLOYMENT_DIR="$PROJECT_ROOT/deployment"

# ── Argument parsing ──────────────────────────────────────────────────────────

ENV_NAME=""

for arg in "$@"; do
  case "$arg" in
    --env=*) ENV_NAME="${arg#--env=}" ;;
    *) echo "ERROR: Unknown argument: $arg"; exit 1 ;;
  esac
done

if [[ -z "$ENV_NAME" ]]; then
  echo "ERROR: --env=<staging|production> is required."
  exit 1
fi

CONFIG_FILE="$DEPLOYMENT_DIR/$ENV_NAME.yml"
if [[ ! -f "$CONFIG_FILE" ]]; then
  echo "ERROR: $CONFIG_FILE not found."
  exit 1
fi

# ── Prerequisites ─────────────────────────────────────────────────────────────

if ! pnpm exec vercel whoami &>/dev/null 2>&1; then
  echo "ERROR: Not authenticated with Vercel. Run: pnpm exec vercel login"
  exit 1
fi

# Read auth token from the Vercel CLI config (macOS or Linux path)
VERCEL_TOKEN=$(node -e "
  const fs = require('fs');
  const os = require('os');
  const paths = [
    os.homedir() + '/Library/Application Support/com.vercel.cli/auth.json',
    os.homedir() + '/.local/share/com.vercel.cli/auth.json',
  ];
  for (const p of paths) {
    if (fs.existsSync(p)) {
      const a = JSON.parse(fs.readFileSync(p, 'utf8'));
      const t = (a.token && typeof a.token === 'object') ? Object.values(a.token)[0] : a.token;
      if (t) { process.stdout.write(t); break; }
    }
  }
")
if [[ -z "$VERCEL_TOKEN" ]]; then
  echo "ERROR: Could not read Vercel auth token. Run: pnpm exec vercel login"
  exit 1
fi

# Read project and org IDs from the linked .vercel/project.json
VERCEL_PROJECT_ID=$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('$PROJECT_ROOT/.vercel/project.json','utf8')).projectId)")
VERCEL_ORG_ID=$(node -e "process.stdout.write(JSON.parse(require('fs').readFileSync('$PROJECT_ROOT/.vercel/project.json','utf8')).orgId)")
if [[ -z "$VERCEL_PROJECT_ID" || -z "$VERCEL_ORG_ID" ]]; then
  echo "ERROR: .vercel/project.json not found or missing IDs. Run: pnpm exec vercel link"
  exit 1
fi

# ── Map environment name to Vercel target ─────────────────────────────────────

case "$ENV_NAME" in
  staging)    VERCEL_ENV="preview" ;;
  production) VERCEL_ENV="production" ;;
  *) echo "ERROR: Unknown environment: $ENV_NAME"; exit 1 ;;
esac

# ── Sync YAML variables to Vercel ────────────────────────────────────────────

echo "Syncing $CONFIG_FILE to Vercel ($VERCEL_ENV)..."

CONFIG_FILE="$CONFIG_FILE" \
VERCEL_ENV="$VERCEL_ENV" \
VERCEL_PROJECT_ID="$VERCEL_PROJECT_ID" \
VERCEL_ORG_ID="$VERCEL_ORG_ID" \
VERCEL_TOKEN="$VERCEL_TOKEN" \
node <<'NODE'
const fs = require('fs');
const https = require('https');

const {
  CONFIG_FILE: configFile,
  VERCEL_ENV: vercelEnv,
  VERCEL_PROJECT_ID: projectId,
  VERCEL_ORG_ID: orgId,
  VERCEL_TOKEN: token,
} = process.env;

const content = fs.readFileSync(configFile, 'utf8');
const lines = content.split('\n');
const vars = {};
let inVars = false;
for (const rawLine of lines) {
  const stripped = rawLine.replace(/#.*$/, '');
  const trimmed = stripped.trim();
  if (trimmed === 'variables:') { inVars = true; continue; }
  if (inVars) {
    if (trimmed && !rawLine.startsWith(' ')) { inVars = false; continue; }
    const colonIndex = trimmed.indexOf(':');
    if (colonIndex !== -1 && !rawLine.trim().startsWith('#')) {
      const key = trimmed.slice(0, colonIndex).trim();
      const rawValue = trimmed.slice(colonIndex + 1).trim().replace(/^"|"$|^'|'$/g, '');
      if (key && rawValue !== '') vars[key] = rawValue;
    }
  }
}

function upsertEnv(key, value) {
  const body = JSON.stringify({ key, value, target: [vercelEnv], type: 'plain' });
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: 'api.vercel.com',
        path: `/v10/projects/${projectId}/env?teamId=${orgId}&upsert=true`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = '';
        res.on('data', (c) => (data += c));
        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve();
          else reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        });
      },
    );
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  for (const [key, value] of Object.entries(vars)) {
    await upsertEnv(key, value);
    process.stdout.write(`  Synced ${key}\n`);
  }
})().catch((e) => {
  process.stderr.write(`ERROR: ${e.message}\n`);
  process.exit(1);
});
NODE

echo ""
echo "Done. Run 'pnpm env:pull' to refresh your local .env.local."
