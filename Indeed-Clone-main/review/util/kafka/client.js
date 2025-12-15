/* eslint-disable global-require */
/* eslint-disable camelcase */
const rpc = new (require('./kafkarpc'))();

// make request to kafka
function makeRequest(queue_name, msg_payload, callback) {
  console.log('Kafka disabled for local development');
  // Return mock response for local development
  callback(null, { success: true, message: 'Kafka disabled' });
}

module.exports = { makeRequest };
