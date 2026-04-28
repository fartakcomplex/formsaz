#!/bin/bash
cd /home/z/my-project
while true; do
  if ! pgrep -f "node.*standalone" > /dev/null 2>&1; then
    echo "[$(date)] Restarting server..." >> /home/z/my-project/dev.log
    node .next/standalone/server.js >> /home/z/my-project/dev.log 2>&1 &
  fi
  # Self-ping to keep process alive
  curl -s -o /dev/null --max-time 5 http://localhost:3000 > /dev/null 2>&1
  sleep 3
done
