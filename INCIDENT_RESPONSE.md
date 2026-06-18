# AsideMe — Incident Response Runbook

One page. When something breaks at 2 AM, this is what to do.

---

## First five minutes

**1. Confirm the scope.** Is one user affected or everyone?

```sh
fly status                              # is the machine running?
fly logs                                # tail recent server logs
curl https://asideme.app/health           # API healthy?
curl https://asideme.app/ready            # database + STT provider ready?
```

If `/health` returns 200 but users report problems, it's a feature outage, not an infra outage. Jump to the relevant section below.

**2. Check the providers.** Most AsideMe outages start upstream:

| Provider | Status page |
|---|---|
| Anthropic (Claude) | https://status.anthropic.com |
| Deepgram (transcription) | https://status.deepgram.com |
| Stripe (payments) | https://status.stripe.com |
| Resend (email) | https://resend-status.com |
| Fly.io (hosting) | https://status.flyio.net |

**3. Communicate.** If the outage is >15 min and customer-visible, post a 1-line update at `/landing/status.html` (manual incident text block). Tell the support inbox first.

---

## Common breakage modes

### 🔴 No magic-link emails arriving
Symptom: users sign up but never receive the link. They retry, give up, churn.

Most likely:
- `RESEND_API_KEY` invalid or rotated → check `fly secrets list | grep RESEND`
- Sender domain (`asideme.app`) failing DMARC/SPF/DKIM → check Resend dashboard "Domains" tab
- Resend itself is having an incident → check status page
- The user's email is in the rate limit cool-off (`canIssueMagicLinkFor` — 5/hr per email)

Workaround while broken: tell the user via support email, set their `email_verified_at` manually via `fly ssh console` → `sqlite3 /data/devlisten.db "UPDATE users SET email_verified_at = unixepoch() WHERE email = '<email>'"`.

### 🔴 AI answers are timing out / 5xx
Symptom: chat hangs, quiz/summary fails with `Failed to fetch` or 500.

Most likely:
- Anthropic outage → check status page, no fix on our end
- Anthropic spending cap hit → check `console.anthropic.com/settings/limits`, raise if cap reached legitimately
- `ANTHROPIC_API_KEY` rotated/revoked → check `fly secrets list | grep ANTHROPIC`
- Rate limited (429) by Anthropic → the per-user daily cap should prevent this, but a key shared between dev + prod can do it

Check first:
```sh
fly logs | grep -iE "anthropic|claude|429|401"
```

### 🔴 Recording starts but no transcript appears
Symptom: mic indicator goes red but the live transcript stays empty.

Most likely:
- Deepgram outage or invalid `DEEPGRAM_API_KEY` → falls back to browser Web Speech API which is unreliable
- iOS Safari user — backgrounded the tab → mic permission revoked → the consent flow should re-prompt
- WebSocket auth failed (rare; cookie invalidated mid-session) → server log will show `WS upgrade rejected: 401`

```sh
fly logs | grep -iE "deepgram|stt|ws upgrade|transcribe"
```

### 🔴 Stripe webhook is failing → users charged but not upgraded
Symptom: user paid but `/api/me` still says `plan: trial`. Or auto-renewals don't refresh `subscription_period_end`.

Most likely:
- Webhook secret mismatch (`STRIPE_WEBHOOK_SECRET`) → check Stripe dashboard "Webhooks" tab
- Webhook URL not registered or pointing wrong → must be `https://asideme.app/api/webhooks/stripe`
- Stripe deliverability blip → the daily reconciliation cron fixes drift within 24 hours

To force a reconciliation now (sshable):
```sh
fly ssh console -C "sqlite3 /data/devlisten.db \"SELECT id, email, plan, subscription_status FROM users WHERE stripe_subscription_id IS NOT NULL\""
```

For a single user, replay the webhook from Stripe dashboard → Webhooks → Recent deliveries → "Resend".

### 🔴 Database corruption / data loss
Symptom: `/ready` returns 500 with "Database file is encrypted or is not a database". Or rows are missing.

Stop the world. **Do not restart the machine until you've checked this.**

```sh
fly ssh console
ls -la /data/devlisten.db*
sqlite3 /data/devlisten.db "PRAGMA integrity_check"
```

If integrity_check returns errors:
1. Take a snapshot immediately: `fly volumes snapshots create <volume_id>`
2. Restore the most recent good snapshot: `fly volumes snapshots restore <snapshot_id>`
3. Tell affected users — anything created since the last snapshot is gone

Daily Fly snapshots should be configured. If they're not, that's a P0 ops gap.

### 🔴 Fly machine won't start / crashlooping
```sh
fly status
fly machines list
fly logs --no-tail | tail -100
```

Common causes:
- Env var typo after a `fly secrets set` → check the latest secret deploy
- Disk full on the volume → `fly ssh console -C "df -h /data"`
- A migration in `db.js` that fails on first boot → log will show the SQL error

To roll back to the previous good release:
```sh
fly releases
fly deploy --image registry.fly.io/aside:deployment-<prev-id>
```

### 🔴 Abuse-report flood
Symptom: `abuse_reports` table fills up with spam reports. Per-IP rate limit (10/15min) should catch most.

```sh
fly ssh console -C "sqlite3 /data/devlisten.db 'SELECT ip, COUNT(*) FROM abuse_reports WHERE created_at > unixepoch() - 86400 GROUP BY ip ORDER BY 2 DESC LIMIT 10'"
```

Block bad IPs via Fly's firewall:
```sh
fly machine update --add-network-block <ip>
```

### 🔴 DMCA notice received
1. Acknowledge to `dmca@asideme.app` sender within 1 hour with a reference ID.
2. Review notice for §512(c)(3)(A) compliance — see `/landing/dmca.html` checklist.
3. If valid, mark the report `status = removed` via admin queue and the content is taken down.
4. Notify the user whose content was removed via the email on file, link to counter-notification process.
5. If counter-notification arrives and is valid, forward to original claimant. Restore in 10–14 business days unless court action filed.

---

## Channels

| When | Who | How |
|---|---|---|
| Anything affecting > 1 user | Both partners | Phone/text first |
| Customer report via `hello@asideme.app` | Whoever's on duty | Acknowledge in < 2 hrs |
| DMCA via `dmca@asideme.app` | Whoever's on duty | Acknowledge in < 1 hr |
| Security incident (breach, leak) | Both partners + counsel | Phone first, written follow-up within 24 hrs |

---

## After the incident

1. Document what happened in a postmortem (date, scope, root cause, what was tried, what worked).
2. If users were affected → email them with what happened + what you did.
3. Decide if Privacy/Terms required a notification (data breach? GDPR 72-hour rule).
4. Add the failure mode to this runbook so next time is faster.

---

## What this runbook does NOT cover

- Security incidents (data breach) — escalate to counsel, not this runbook.
- Legal subpoenas / law enforcement — escalate to counsel.
- Major version migrations / planned outages — separate runbook.

When in doubt, **don't guess** — call your partner.
