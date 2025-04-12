import axios from 'axios';
import { store } from '@/store/store';
import { selectToken, setAccessToken, resetDetails } from '@/store/slices/loginSlices';

const { VITE_SERVER_URL } = import.meta.env || {};

export default axios.create({
  baseURL: VITE_SERVER_URL
});

const axiosPrivate = axios.create({
  baseURL: VITE_SERVER_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

axiosPrivate.interceptors.request.use(
  (config) => {
    const { accessToken: ACCESS_TOKEN, refreshToken: REFRESH_TOKEN } = selectToken(store.getState());

    if (!config.headers["authorization"]) {
      config.headers[
        "authorization"
      ] = `Bearer ${ACCESS_TOKEN}`;
    }

    if (!config.headers["refresh-token"]) {
      config.headers[
        "refresh-token"
      ] = `${REFRESH_TOKEN}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  async (response) => {
    const authorization = response?.headers?.authorization || "";
    const newAccessToken = authorization.split(" ")[1] || "";

    if (newAccessToken !== "") {
      store.dispatch(setAccessToken({ accessToken: newAccessToken }));
    }

    return response;
  },
  async (error) => {
    if (error?.response?.status === 401) {
      store.dispatch(resetDetails());
    } else {
      const authorization = error?.response?.headers?.authorization || "";
      const newAccessToken = authorization.split(" ")[1] || "";

      if (newAccessToken !== "") {
        store.dispatch(setAccessToken({ accessToken: newAccessToken }));
      }
    }
    return Promise.reject(error);
  }
)

export { axiosPrivate };