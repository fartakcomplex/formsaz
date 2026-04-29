const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const fs = require('fs');
const path = require('path');

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const filePath = path.join(__dirname, '.next', 'standalone', '.next', parsedUrl.pathname);
    
    // Try to serve static files from standalone/.next/static
    if (parsedUrl.pathname.startsWith('/_next/static/')) {
      const staticPath = path.join(__dirname, '.next', 'static', parsedUrl.pathname.replace('/_next/static/', ''));
      if (fs.existsSync(staticPath)) {
        const ext = path.extname(staticPath);
        const types = { '.js': 'text/javascript', '.css': 'text/css', '.woff': 'font/woff', '.woff2': 'font/woff2' };
        res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
        fs.createReadStream(staticPath).pipe(res);
        return;
      }
    }
    
    handle(req, res, parsedUrl);
  }).listen(3000, () => console.log('Custom server on :3000'));
});
