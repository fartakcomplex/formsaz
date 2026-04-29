#!/bin/bash
# Keep-alive script for Next.js production server
cd /home/z/my-project

while true; do
  # Check if server is running
  if ! curl -s --max-time 3 http://localhost:3000/ > /dev/null 2>&1; then
    echo "[$(date)] Server not responding, restarting..." >> keep-alive.log
    # Kill any leftover processes
    pkill -f "node .next/standalone/server.js" 2>/dev/null
    sleep 2
    # Start production server
    NODE_ENV=production nohup node .next/standalone/server.js >> server.log 2>&1 &
    echo "[$(date)] Server restarted with PID $!" >> keep-alive.log
    sleep 5
  fi
  sleep 15
done
