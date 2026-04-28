const http = require('http');
const { execSync } = require('child_process');

// Health check endpoint that also restarts if needed
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

server.listen(3001, () => {
  console.log('Keepalive proxy on :3001');
});

// Start the main server
const mainServer = require('./.next/standalone/server.js');
