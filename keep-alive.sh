#!/bin/bash
while true; do
  if ! curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null | grep -q "200"; then
    echo "$(date): Server down, restarting..." >> /home/z/my-project/keep-alive.log
    cd /home/z/my-project
    pkill -f "next dev" 2>/dev/null
    pkill -f "next-server" 2>/dev/null
    sleep 2
    bun run dev > /home/z/my-project/dev.log 2>&1 &
  fi
  sleep 60
done
