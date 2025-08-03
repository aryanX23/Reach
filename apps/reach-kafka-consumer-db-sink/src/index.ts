import dotenv from "dotenv";
dotenv.config();
import { Kafka, logLevel } from "kafkajs";
import connectDatabase, {
	disconnectDatabase,
} from "./configs/mongoose-configs";
import { handleMessageStreamWrites } from "./modules/handleMessageStreamWrites";

// Kafka broker configuration
const kafka = new Kafka({
	clientId: "reach-kafka-engine",
	brokers: ["localhost:9092"],
	logLevel: logLevel.ERROR, // Set log level to ERROR to minimize noise
});

const admin = kafka.admin();
const consumer = kafka.consumer({
	groupId: "my-group",
	minBytes: 1024 * 10, // 10KB
	maxWaitTimeInMs: 5000, // 5 seconds
	sessionTimeout: 300000, // 5 minutes
	heartbeatInterval: 10000, // 10 seconds
});

const main = async () => {
	try {
		await connectDatabase();

		// 1. Connect to Kafka
		await admin.connect();
		await consumer.connect();

		// 2. Check if the topic exists and create it if it doesn't
		const topicName = "chat-messages";
		console.log(`Checking if topic "${topicName}" exists...`);

		// Fetch the list of all topic names in the cluster
		const existingTopics = await admin.listTopics();

		if (!existingTopics.includes(topicName)) {
			console.log(`Topic "${topicName}" does not exist, creating it...`);
			await admin.createTopics({
				topics: [
					{
						topic: topicName,
						numPartitions: 1,
						replicationFactor: 1,
					},
				],
			});
			console.log(`Topic "${topicName}" created successfully.`);
		} else {
			console.log(`Topic "${topicName}" already exists.`);
		}

		// 3. Subscribe to the topic
		await consumer.subscribe({ topic: topicName, fromBeginning: true });

		// 4. Start consuming messages
		await consumer.run({
			eachBatch: handleMessageStreamWrites,
		});

		console.log("Consumer is running...");
	} catch (error) {
		console.error("Error in Kafka setup:", error);
		process.exit(1);
	}
};

// Graceful shutdown
const shutdown = async () => {
	try {
		await consumer.disconnect();
		await admin.disconnect();
		await disconnectDatabase();
		console.log("Disconnected from Kafka and MongoDB");
		process.exit(0);
	} catch (error) {
		console.error("Error during shutdown:", error);
		process.exit(1);
	}
};

// Run the main function and handle shutdown signals
main();

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
