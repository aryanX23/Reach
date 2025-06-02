import { axiosPrivate } from "../utils/AxiosUtils/axiosConfig";

const getActiveConversations = async () => {
  try {
    const res = await axiosPrivate.get(
      "/api/conversations/get-active-conversations",
    );
    return res.data;
  } catch (error) {
    throw error.response.data;
  }
};

const ConversationService = {
  getActiveConversations,
};

export default ConversationService;
