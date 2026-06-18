# AsideMe — production Dockerfile.
# Targets: Node 22 LTS on slim Debian for native better-sqlite3 build.
#
# Build:  docker build -t aside .
# Run:    docker run -p 3001:3001 --env-file .env -v aside-data:/data aside
#
# On Fly.io, the persistent volume mounts at /data — see fly.toml.

FROM node:22-slim AS deps
WORKDIR /app

# Native build deps for better-sqlite3 (gcc + python). Removed in the final
# stage so they don't bloat the runtime image.
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 build-essential \
    && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
# --no-audit --no-fund speeds up CI builds significantly.
RUN npm ci --omit=dev --no-audit --no-fund

# ── Runtime image ────────────────────────────────────────────────────────────
FROM node:22-slim AS runtime
WORKDIR /app

# gosu lets the root entrypoint drop to `aside` with correct signal forwarding
# (unlike su), so SIGTERM still reaches Node for graceful shutdown.
RUN apt-get update && apt-get install -y --no-install-recommends gosu \
    && rm -rf /var/lib/apt/lists/*

# Run as non-root. `aside` owns the app files; the entrypoint chowns the
# persistent volume at runtime, then execs the app as this user.
RUN groupadd -r aside && useradd -r -g aside aside

# Copy production node_modules from deps stage.
COPY --from=deps /app/node_modules ./node_modules
COPY --chown=aside:aside . .

# DB lives on the persistent volume mounted at /data.
ENV DATABASE_PATH=/data/devlisten.db
RUN mkdir -p /data && chown -R aside:aside /data

# Entrypoint runs as root only long enough to fix /data ownership (the Fly
# volume mounts root-owned on first boot), then drops to `aside` via gosu.
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3001

# Healthcheck — Fly.io reads this for service health.
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3001/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["node", "server.js"]
