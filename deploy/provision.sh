#!/usr/bin/env bash
# Run this ON the GCE VM (after `gcloud compute ssh asideme`). Installs Docker,
# adds a swap file (the 1GB e2-micro needs headroom to build better-sqlite3 and
# run comfortably), and clones the repo. Re-runnable.
set -euo pipefail

echo "==> Adding 2GB swap (skip if present)"
if ! sudo swapon --show | grep -q /swapfile; then
  sudo fallocate -l 2G /swapfile
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
fi

echo "==> Installing Docker + git"
sudo apt-get update
sudo apt-get install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker "$USER"

echo
echo "============================================================"
echo " Docker installed. Log out and back in (so the docker group"
echo " applies), then:"
echo
echo "   git clone https://github.com/singlefatherhustle/asideme.git"
echo "   cd asideme"
echo "   cp .env.example .env && nano .env      # fill in secrets"
echo "   mkdir -p data"
echo "   docker compose up -d --build"
echo
echo " (Private repo: when git prompts, use your GitHub username +"
echo "  a Personal Access Token with 'repo' scope as the password.)"
echo "============================================================"
