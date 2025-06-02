import { axiosPrivate } from "../utils/AxiosUtils/axiosConfig";

const sendFriendRequest = ({ id }) => {
  return axiosPrivate.get(`/api/users/send-friend-request`, {
    params: {
      id,
    },
  });
};

const getPendingFriendRequests = () => {
  return axiosPrivate.get(`/api/users/pending-friend-requests`);
};

const acceptFriendRequest = ({ id }) => {
  return axiosPrivate.get(`/api/users/accept-friend-request`, {
    params: {
      id,
    },
  });
};

const rejectFriendRequest = ({ id }) => {
  return axiosPrivate.get(`/api/users/reject-friend-request`, {
    params: {
      id,
    },
  });
};

const getFriendList = () => {
  return axiosPrivate.get(`/api/users/friend-list`);
};

const UserService = {
  sendFriendRequest,
  getPendingFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  getFriendList,
};

export default UserService;
