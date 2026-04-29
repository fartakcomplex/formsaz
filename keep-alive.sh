#!/bin/bash
# Keep-alive watchdog for Next.js dev server
LOG="/home/z/my-project/dev.log"
while true; do
  cd /home/z/my-project
  echo "[$(date)] Starting server..." >> "$LOG"
  npx next dev --port 3000 >> "$LOG" 2>&1
  EXIT_CODE=$?
  echo "[$(date)] Server exited with code $EXIT_CODE, restarting in 3s..." >> "$LOG"
  sleep 3
done
