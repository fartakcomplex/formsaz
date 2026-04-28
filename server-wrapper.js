const { spawn } = require('child_process');
const path = require('path');

function startServer() {
  const serverPath = path.join(__dirname, '.next/standalone/server.js');
  const child = spawn(process.execPath, [serverPath], {
    stdio: ['inherit', 'inherit', 'inherit'],
    env: { ...process.env, PORT: '3000', HOSTNAME: '0.0.0.0' }
  });
  
  child.on('exit', (code) => {
    console.log(`[wrapper] Server exited with code ${code}. Restarting in 1s...`);
    setTimeout(startServer, 1000);
  });
  
  child.on('error', (err) => {
    console.error(`[wrapper] Server error:`, err);
    setTimeout(startServer, 1000);
  });
}

console.log('[wrapper] Starting server with auto-restart...');
startServer();
