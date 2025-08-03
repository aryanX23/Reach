import { Schema, model } from "mongoose";

const messageSchema = new Schema(
	{
		conversationId: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		senderId: {
			type: String,
			required: true,
		},
		type: {
			type: String,
			required: true,
			enum: ["text", "image", "video", "audio", "file"],
			default: "text",
		},
		status: {
			type: String,
			required: true,
			enum: ["sent", "delivered", "read", "deleted"],
			default: "sent",
		},
		timestamps: {
			sentAt: {
				type: Date,
			},
			deliveredAt: {
				type: Date,
			},
			readAt: {
				type: Date,
			},
			deletedAt: {
				type: Date,
			},
		},
		messageTime: {
			type: Date,
		},
		messageTimezone: {
			type: String,
		},
	},
	{
		timestamps: true,
		collection: "messages",
	}
);

const Message = model("Message", messageSchema);
export default Message;
