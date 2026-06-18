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
  # Only append to fstab if not already there (avoids a duplicate line when swap
  # was configured before but is inactive after a reboot/swapoff).
  if ! grep -q '/swapfile' /etc/fstab; then
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
  fi
fi

echo "==> Installing Docker + git (official Docker apt repo, GPG-verified)"
sudo apt-get update
sudo apt-get install -y ca-certificates curl git gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  | sudo tee /etc/apt/sources.list.d/docker.list >/dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
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
