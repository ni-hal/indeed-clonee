/* eslint-disable global-require */
const http = require('http');
require('./config');
const { redisClient } = require('u-server-utils');
const { initDB } = require('./db');
const app = require('./app');
const { createKafkaTopics } = require('./util/kafka/topics');

initDB();
// createKafkaTopics(); // Disabled Kafka for local development
// redisClient.connect().then(() => { // Disabled Redis for local development
const port = process.env.PORT || '4000';
app.set('port', port);
const server = http.createServer(app);
server.listen(port);
server.on('error', (err) => {
  console.error(err);
});
server.on('listening', () => {
  console.log(`Server listening on ${server.address().port}`);
});
// });
