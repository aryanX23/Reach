const { z } = require('zod');

const { zodErrorFormatter } = require("../../../utils/zodErrorFormatter");

const validateGetMessage = (req, res, next) => {
  
  const schema = z.object({
    conversationId: z.string({
      required_error: 'Conversation ID is required',
      invalid_type_error: 'Conversation ID must be a string',
    })
      .startsWith('CONVERSATION-'),
    messageRange: z.enum(['24_hour' ,'today', 'week', 'month', 'all'])
      .default('24_hour'),
    messageFetchDirection: z.enum(['newer', 'older'])
      .default('newer'),
    lastMessageTimestamp: z.string({
      invalid_type_error: 'Last message timestamp must be a string',
    }).optional(),
  });

  const { success, error, data } = schema.safeParse(req.query);
  if (!success) {
    const zodFormattedError = zodErrorFormatter(error);
    console.error("Validation error:", zodFormattedError);
    return res.status(400).send({ errorCode: "GET_MESSAGE_VALIDATION_ERROR", errorMessage: zodFormattedError, success: false });
  }

  req.query = data;
  next();
}

module.exports = {
  validateGetMessage,
};