import { notification } from "antd";
import axios from "axios";
import { refreshToken } from "../api";
import router from "../router/routes";
import { APP_CONFIG } from "./constants";
import jwt from "./jwt";

const instance = axios.create({
  timeout: 20000,
  baseURL: APP_CONFIG.apiUrl,
  headers: {
    Authorization: `Bearer ${jwt.getAccessToken()}`,
    accept: "application/json",
    withCredentials: false,
    credentials: "include",
    crossDomain: true,
    common: {
      "X-Requested-With": "XMLHttpRequest",
    },
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((req) => {
  req.headers.Authorization = `Bearer ${jwt.getAccessToken()}`;
  return req;
});

instance.interceptors.response.use(
  async (res) => {
    return res;
  },
  async (error) => {
    const config = error?.config;
    const controller = new AbortController();

    if (
      config.url.includes("login") ||
      config.url.includes("Authentication/Refresh")
    ) {
      controller.abort();
      jwt.resetAccessToken();
      router.navigate("/login");
      return Promise.reject(error);
    }

    if (error.response.status === 401) {
      try {
        var access_token;
        await refreshToken().then((res) => {
          jwt.setRefreshToken(res.refreshToken);
          jwt.setAccessToken(res.token);
          return (access_token = res.token);
        });

        if (access_token && access_token.length > 0) {
          instance.defaults.headers.Authorization = `Bearer ${access_token}`;
          return instance(config);
        }
      } catch (error) {
        controller.abort();
        jwt.resetAccessToken();
        router.navigate("/login");
      }
    }

    if (error.response.status === 403) {
      notification.warning({
        message: `Bạn không có quyền truy cập.`,
        description: "Vui lòng liên hệ người quản lý !",
      });
      controller.abort();
      router.navigate(-1);
    }

    return Promise.reject(error);
  }
);

export default instance;
