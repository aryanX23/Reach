const { Kafka, logLevel } = require('kafkajs');

const { KAFKA_URI = "localhost:9092" } = process.env;

class KafkaService {
  /**
   * @param {string} clientId - The client ID for this Kafka instance.
   */
  constructor(clientId = 'reach-kafka-engine') {
    this.kafka = new Kafka({
      clientId: clientId,
      brokers: [KAFKA_URI],
      logLevel: logLevel.WARN,
    });

    this.producer = null;
    this.consumer = null;
    this.admin = null;
  }

  async connect() {
    try {
      console.log('Connecting to Kafka...');

      // Create a producer instance and connect it
      this.producer = this.kafka.producer();
      await this.producer.connect();
      console.log('Kafka Producer connected successfully.');
    } catch (error) {
      console.error('Failed to connect Kafka Producer:', error);
      process.exit(1);
    }
  }

  /**
   * Sends a message to a specific Kafka topic.
   * Assumes the producer is already connected.
   * @param {string} topic - The topic to send the message to.
   * @param {object} payload - The message payload. Will be stringified.
   * @param {string} [key] - Optional message key for partitioning.
   */
  async sendMessage(topic, payload, key) {
    if (!this.producer) {
      throw new Error('Producer is not connected. Please call connect() first.');
    }

    try {
      const messageValue = JSON.stringify(payload);

      const message = {
        value: messageValue,
      };

      if (key) {
        message.key = key;
      }

      await this.producer.send({
        topic: topic,
        messages: [message],
      });
    } catch (error) {
      console.error(`Failed to send message to topic ${topic}:`, error);
    }
  }

  /**
   * Starts a consumer and subscribes to topics.
   * @param {string} groupId - The consumer group ID.
   * @param {string[]} topics - An array of topics to subscribe to.
   * @param {function} eachMessage - The callback function to handle each message.
   */
  async startConsumer(groupId, topics, eachMessage) {
    try {
      this.consumer = this.kafka.consumer({ groupId });
      await this.consumer.connect();

      for (const topic of topics) {
        await this.consumer.subscribe({ topic, fromBeginning: true });
      }

      await this.consumer.run({
        eachMessage: eachMessage,
      });

      console.log(`Consumer with groupId "${groupId}" started and subscribed to topics:`, topics);
    } catch (error) {
      console.error('Failed to start Kafka Consumer:', error);
    }
  }

  /**
   * Disconnects the producer and consumer gracefully.
   * This should be called when your application is shutting down.
   */
  async disconnect() {
    try {
      if (this.producer) {
        await this.producer.disconnect();
        console.log('Kafka Producer disconnected.');
      }
      if (this.consumer) {
        await this.consumer.disconnect();
        console.log('Kafka Consumer disconnected.');
      }
    } catch (error) {
      console.error('Failed to disconnect Kafka clients:', error);
    }
  }
}

module.exports = new KafkaService();