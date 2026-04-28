#!/bin/bash
cd /home/z/my-project
while true; do
  echo "[$(date)] Starting Next.js dev server..."
  NEXT_TELEMETRY_DISABLED=1 npx next dev -p 3000 2>&1 | tee -a /home/z/my-project/dev.log
  echo "[$(date)] Server exited. Restarting in 3s..."
  sleep 3
done
