#!/bin/bash
cd /home/z/my-project
while true; do
  echo "=== Starting server $(date) ===" >> /home/z/my-project/dev.log
  node .next/standalone/server.js >> /home/z/my-project/dev.log 2>&1
  EXIT_CODE=$?
  echo "=== Server exited with code $EXIT_CODE $(date) ===" >> /home/z/my-project/dev.log
  sleep 1
done
