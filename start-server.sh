#!/bin/bash
cd /home/z/my-project
while true; do
  NODE_ENV=production node .next/standalone/server.js 2>&1 | tee -a dev.log &
  CHILD=$!
  # Monitor the child - if it dies, restart
  wait $CHILD
  echo "[$(date)] Server died. Restarting in 1s..."
  sleep 1
done
