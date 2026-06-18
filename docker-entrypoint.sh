#!/bin/sh
set -e

# The Fly.io persistent volume mounts at /data owned by root on first boot.
# The app runs as the non-root `aside` user, so without this it would hit
# EACCES creating/opening /data/devlisten.db. Fix ownership while we're still
# root, then drop privileges to `aside` (gosu forwards signals correctly, so
# SIGTERM still reaches Node for graceful shutdown).
if [ -d /data ]; then
  chown -R aside:aside /data 2>/dev/null || true
fi

exec gosu aside "$@"
