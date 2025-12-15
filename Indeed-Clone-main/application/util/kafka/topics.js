const kafka = require('kafka-node');

const createKafkaTopics = () => {
  console.log('Connecting to Kafka at:', global.gConfig.kafka_host);
  
  const client = new kafka.KafkaClient({
    kafkaHost: global.gConfig.kafka_host,
  });
  
  client.on('error', (err) => {
    console.error('Kafka client error:', err);
  });
  
  client.on('ready', () => {
    console.log('Kafka client connected successfully');
  });
  
  const admin = new kafka.Admin(client);
  admin.createTopics(
    [
      {
        topic: 'response_topic',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'application.create',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'application.update',
        partitions: 1,
        replicationFactor: 1,
      },
      {
        topic: 'application.delete',
        partitions: 1,
        replicationFactor: 1,
      },
    ],
    (err) => {
      if (err) {
        console.error('Failed to create topics:', err);
      } else {
        console.log('Kafka topics created successfully');
      }
    },
  );
};

module.exports = {
  createKafkaTopics,
};
