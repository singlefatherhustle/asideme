# Deploying AsideMe to Google Cloud (free-tier VM)

AsideMe runs as a single always-on container with SQLite on disk, fronted by
Caddy for automatic HTTPS. Target: a **free-tier `e2-micro` GCE VM** — $0/month
within the always-free limits (us-west1 / us-central1 / us-east1, one instance,
≤30GB standard disk).

Domain `asideme.app` is registered at **GoDaddy**; we point an A record at the
VM's static IP. No Postgres, no load balancer, no Fly.

---

## Prerequisites (on your laptop)

- `gcloud` CLI installed + authenticated: `gcloud auth login`
- A GCP project with billing enabled (you have this under singlefatherhustle@gmail.com)
- A GitHub Personal Access Token with `repo` scope (the repo is private) —
  https://github.com/settings/tokens

---

## 1. Create the VM (laptop)

```bash
export GCP_PROJECT=<your-project-id>
./deploy/setup-vm.sh
```

This reserves a static IP, opens ports 80/443, and creates the `asideme` VM.
**Copy the static IP it prints** — you need it for DNS.

## 2. Point the domain (GoDaddy)

In GoDaddy → `asideme.app` → DNS → Records, set (delete any conflicting
`@`/`www` A, AAAA, or CNAME records first):

| Type | Name | Value            | TTL  |
|------|------|------------------|------|
| A    | @    | `<STATIC_IP>`    | 600  |
| A    | www  | `<STATIC_IP>`    | 600  |

DNS can take a few minutes to an hour to propagate. Check with:
`dig +short asideme.app` — it should return your static IP before step 5.

## 3. Provision the VM (on the VM)

```bash
gcloud compute ssh asideme --zone us-central1-a
# now on the VM:
curl -fsSL https://raw.githubusercontent.com/singlefatherhustle/asideme/main/deploy/provision.sh | bash
# OR clone first (private repo) and run ./deploy/provision.sh
```

Installs Docker + a 2GB swap file (the 1GB VM needs it to build the native
SQLite module). **Log out and back in** afterward so the `docker` group applies.

## 4. Configure secrets + launch (on the VM)

```bash
git clone https://github.com/singlefatherhustle/asideme.git
cd asideme
mkdir -p data
cp .env.example .env
nano .env        # fill in the values below
docker compose up -d --build
```

### Minimum `.env` for a working deploy

```bash
# --- Required (security) ---
SESSION_SECRET=          # openssl rand -hex 32
KEY_ENC_SECRET=          # openssl rand -hex 32   (encrypts BYOK keys)

# --- Required (at least one LLM provider; Gemini is the default) ---
GEMINI_API_KEY=          # free: https://aistudio.google.com/apikey
GROQ_API_KEY=            # free fallback: https://console.groq.com/keys

# --- Required because email verification is ON in compose ---
RESEND_API_KEY=          # https://resend.com  (verify the asideme.app domain)
EMAIL_FROM=AsideMe <noreply@asideme.app>

# --- Recommended ---
SENTRY_DSN=              # error tracking
METRICS_TOKEN=           # openssl rand -hex 32  (protects /metrics)
ADMIN_EMAILS=singlefatherhustle@gmail.com
```

> `APP_URL`, `CORS_ORIGIN`, `NODE_ENV`, `PORT`, `TRUST_PROXY_HOPS`, and
> `REQUIRE_EMAIL_VERIFICATION` are already set in `docker-compose.yml` — don't
> duplicate them in `.env`.
>
> Stripe is optional — the app runs free-for-all without it; payment endpoints
> just return 503 until you add `STRIPE_*` keys.
>
> Email: until the `asideme.app` domain is verified in Resend (SPF/DKIM/DMARC),
> magic-link verification emails won't deliver and users can't log in. To demo
> without email, set `REQUIRE_EMAIL_VERIFICATION=false` in `docker-compose.yml`.

## 5. Verify

```bash
# DNS resolves to the VM, then Caddy issues the cert automatically on first hit.
curl -s https://asideme.app/health         # {"status":"ok",...}
curl -s https://asideme.app/ready          # {"status":"ready",...}
docker compose logs -f caddy               # watch cert issuance
docker compose logs -f app                 # app logs
```

Open https://asideme.app — you should get the landing page over HTTPS.

---

## Operations

| Task | Command (on the VM, in the repo dir) |
|------|--------------------------------------|
| Deploy new code | `git pull && docker compose up -d --build` |
| Restart | `docker compose restart` |
| Logs | `docker compose logs -f app` |
| Stop | `docker compose down` |
| Backup DB | `cp data/devlisten.db data/backup-$(date +%F).db` |
| DB shell | `docker compose exec app node -e "..."` or `sqlite3 data/devlisten.db` |

### Backups
The SQLite DB lives in `./data` on the VM boot disk — it survives reboots and
redeploys, but **not VM deletion**. For real safety, schedule a disk snapshot:
`gcloud compute disks snapshot asideme --zone us-central1-a` (cron it), or copy
`data/devlisten.db` to a Cloud Storage bucket periodically.

### Cost guard
Set a GCP **budget alert** (Billing → Budgets & alerts) at e.g. $5 so any
accidental spend outside the free tier pings you immediately.

---

## Why this shape

- **e2-micro VM, not Cloud Run:** SQLite needs a persistent local disk and a
  single always-on instance. Cloud Run is ephemeral/scale-to-zero and would lose
  or fork the database. The VM keeps the current architecture with zero code
  changes.
- **Caddy, not a GCP load balancer:** the LB costs ~$18/mo; Caddy gives free
  automatic HTTPS on the VM itself.
- **Free:** within the always-free e2-micro + 30GB disk limits, this is $0/month.
