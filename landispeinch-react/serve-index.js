const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;

const root = path.resolve(__dirname, '..'); // serve from project root

const mime = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon'
};

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mime[ext] || 'application/octet-stream';
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const decoded = decodeURIComponent(req.url.split('?')[0]);
  let reqPath = decoded === '/' ? '/index.html' : decoded;
  const filePath = path.join(root, reqPath);

  // Security: avoid directory traversal
  if (!filePath.startsWith(root)) {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    return res.end('Bad request');
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      return serveFile(filePath, res);
    }

    // If not a file, try serving index.html (SPA / fallback)
    const indexPath = path.join(root, 'index.html');
    fs.stat(indexPath, (ie, istats) => {
      if (!ie && istats.isFile()) {
        return serveFile(indexPath, res);
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    });
  });
});

server.listen(PORT, HOST, () => {
  console.log(`Static server serving ${root} on http://${HOST}:${PORT}`);
});

process.on('SIGINT', () => process.exit());
