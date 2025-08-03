import { axiosPrivate } from "../utils/AxiosUtils/axiosConfig";

const getMessageForConversation = ({ conversationId, messageRange, messageFetchDirection, lastMessageTimestamp }) => {
  return axiosPrivate.get(`/api/messages/`, {
    params: {
      conversationId,
      messageRange,
      messageFetchDirection,
      lastMessageTimestamp,
    },
  });
};

const MessagesService = {
  getMessageForConversation
};

export default MessagesService;


