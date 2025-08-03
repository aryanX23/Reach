import mongoose from "mongoose";

const { MONGO_URI = "mongodb://localhost:27017" } = process.env || {};

mongoose.Promise = global.Promise;
const mongooseOptions = {};

const connectDatabase = async () => {
	try {
		const connection = await mongoose.connect(MONGO_URI, mongooseOptions);
		if (connection.connections[0].readyState === 1) {
			console.log("Connected to MongoDB");
		} else {
			console.error("Failed to connect to MongoDB");
			process.exit(1);
		}
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		process.exit(1);
	}
};

export const disconnectDatabase = async () => {
	try {
		await mongoose.disconnect();
		console.log("Disconnected from MongoDB");
	} catch (error) {
		console.error("Error disconnecting from MongoDB:", error);
	}
};

export default connectDatabase;
