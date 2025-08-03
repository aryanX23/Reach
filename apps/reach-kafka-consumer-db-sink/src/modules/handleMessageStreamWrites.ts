import Message from "../models/MessageModel";
import { EachBatchPayload } from "kafkajs";

export const handleMessageStreamWrites = async ({
	batch,
	resolveOffset,
	heartbeat,
}: EachBatchPayload) => {
	const messages = batch.messages
		.filter((message) => message.value)
		.map((message) => {
			const messageBody = JSON.parse(message.value!.toString());
			const {
				roomId: conversationId,
				content: messageText = "",
				senderId,
				type = "text",
				status = "sent",
				time = "",
				timezone = "",
			} = messageBody || {};

			let messageTime;
			if (time) {
				try {
					messageTime = new Date(JSON.parse(time));
				} catch (e) {
					console.error(`Failed to parse time: "${time}". Using current time as fallback.`);
					messageTime = new Date();
				}
			} else {
				messageTime = new Date();
			}

			return {
				conversationId,
				message: messageText,
				senderId,
				type,
				status,
				timestamps: {
					sentAt: new Date(),
				},
				messageTime,
				messageTimezone: timezone,
			};
		});

	if (messages.length === 0) {
		// No valid messages to process, commit offset and proceed
		await resolveOffset(batch.lastOffset());
		await heartbeat();
		return;
	}

	try {
		console.log("Saving messages to the database...");
		await Message.insertMany(messages, { ordered: false });
		console.log(`${messages.length} messages saved to the database`);

		// Commit offsets only after successful insertion
		await resolveOffset(batch.lastOffset());
		await heartbeat();
	} catch (error) {
		console.error("Error saving messages to the database:", error);
		// Do not commit offsets if there is an error, so the batch will be reprocessed.
	}
};
