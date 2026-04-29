#!/bin/bash
# Auto-restart server every 2 minutes
while true; do
  if ! curl -s -o /dev/null -w "%{http_code}" --max-time 5 http://localhost:3000 2>/dev/null | grep -q "200"; then
    echo "[$(date)] Server down, restarting..." >> /home/z/my-project/dev.log
    pkill -f "node.*standalone" 2>/dev/null
    pkill -f "bun.*dev" 2>/dev/null
    sleep 2
    cd /home/z/my-project && node .next/standalone/server.js >> /home/z/my-project/dev.log 2>&1 &
    echo "[$(date)] Server restarted" >> /home/z/my-project/dev.log
  fi
  sleep 120
done
