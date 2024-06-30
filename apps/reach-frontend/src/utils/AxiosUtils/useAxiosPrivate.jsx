import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { axiosPrivate } from "./axiosConfig";
import { setAccessToken, resetDetails } from '../../store/slices/loginSlices';

const useAxiosPrivate = () => {
  const dispatch = useDispatch();

  const ACCESS_TOKEN = useSelector(state => state?.login?.loginDetails?.accessToken || "");
  const REFRESH_TOKEN = useSelector(state => state?.login?.loginDetails?.refreshToken || "");

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
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

    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => {
        const authorization = response?.headers?.authorization || "";
        const newAccessToken = authorization.split(" ")[1] || "";

        if (newAccessToken !== "") {
          dispatch(setAccessToken({ accessToken: newAccessToken }));
        }

        return response;
      },
      async (error) => {
        if (error?.response?.status === 401) {
          await dispatch(resetDetails());
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, []);

  return axiosPrivate;
};

export default useAxiosPrivate;
