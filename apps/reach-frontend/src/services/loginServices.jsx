import axios from "../utils/AxiosUtils/axiosConfig";

const registerUser = (data) => {
  return axios.post(`/api/users/register`, data);
};

const loginUser = (data) => {
  return axios.post(`/api/users/login`, data);
};

const LoginService = {
  loginUser,
  registerUser,
}

export default LoginService;