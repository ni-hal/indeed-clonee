/* eslint-disable global-require */
const http = require('http');
require('./config');
const { initDB } = require('./db');

initDB().then(() => {
  const app = require('./app');
  const port = process.env.PORT || '7000';
  app.set('port', port);
  const server = http.createServer(app);
  server.listen(port);
  server.on('error', (err) => {
    console.error(err);
  });
  server.on('listening', () => {
    console.log(`Auth Server listening on ${server.address().port}`);
  });
}).catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});