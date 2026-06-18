#!/usr/bin/env bash
# Provision the GCP free-tier VM for AsideMe. Run from your laptop with gcloud
# installed and authenticated (gcloud auth login). Idempotent-ish: re-running
# skips resources that already exist.
#
#   GCP_PROJECT=your-project-id ./deploy/setup-vm.sh
#
# Free-tier notes: e2-micro is always-free ONLY in us-west1, us-central1, or
# us-east1, for ONE instance, with a <=30GB standard persistent disk.
set -euo pipefail

PROJECT="${GCP_PROJECT:?Set GCP_PROJECT=your-project-id}"
REGION="${GCP_REGION:-us-central1}"
ZONE="${GCP_ZONE:-us-central1-a}"
VM="${VM_NAME:-asideme}"

gcloud config set project "$PROJECT"

echo "==> Reserving static external IP (asideme-ip) in $REGION"
gcloud compute addresses create asideme-ip --region "$REGION" 2>/dev/null \
  || echo "    (already exists)"
IP="$(gcloud compute addresses describe asideme-ip --region "$REGION" --format='value(address)')"

echo "==> Creating firewall rules for HTTP/HTTPS"
gcloud compute firewall-rules create allow-http \
  --allow tcp:80 --target-tags http-server 2>/dev/null || echo "    (allow-http exists)"
gcloud compute firewall-rules create allow-https \
  --allow tcp:443 --target-tags https-server 2>/dev/null || echo "    (allow-https exists)"

echo "==> Creating e2-micro VM ($VM) in $ZONE"
gcloud compute instances create "$VM" \
  --zone "$ZONE" \
  --machine-type e2-micro \
  --image-family debian-12 --image-project debian-cloud \
  --boot-disk-size 30GB --boot-disk-type pd-standard \
  --address "$IP" \
  --tags http-server,https-server 2>/dev/null \
  || echo "    (instance exists)"

echo
echo "============================================================"
echo " VM ready. Static IP: $IP"
echo
echo " NEXT: in GoDaddy DNS for asideme.app, set these records:"
echo "   A    @     $IP"
echo "   A    www   $IP"
echo " (delete any conflicting A/AAAA/CNAME on @ and www first)"
echo
echo " Then SSH in and deploy:"
echo "   gcloud compute ssh $VM --zone $ZONE"
echo "   # on the VM, follow DEPLOY_GCP.md (provision.sh + compose up)"
echo "============================================================"
