import { axiosPrivate } from "../utils/AxiosUtils/axiosConfig";

const sendFriendRequest = ({ id }) => {
  return axiosPrivate.get(`/api/users/send-friend-request`, {
    params: {
      id
    }
  });
};

const getPendingFriendRequests = () => {
  return axiosPrivate.get(`/api/users/pending-friend-requests`);
};

const UserService = {
  sendFriendRequest,
  getPendingFriendRequests,
}

export default UserService;