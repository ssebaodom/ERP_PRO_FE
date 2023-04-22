import axios from "axios";
import { APP_CONFIG } from "./constants";
import jwt from "./jwt";
import router from "../router/routes";
import { notification } from "antd";

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
    const config = error.config;
    if (config.url.includes("/login") || config.url.includes("/refreshToken")) {
      jwt.resetAccessToken();
      router.navigate("/login");
      return Promise.reject(error);
    }
    if (error.response.status === 401) {
      const access_token = await jwt.claimNewToken();
      if (access_token) {
        instance.defaults.headers.Authorization = access_token;
        return instance(config);
      }
      if (!access_token) {
        jwt.resetAccessToken();
        router.navigate("/login");
      }
      return Promise.reject(error);
    }
    if (error.response.status === 403) {
      notification.warning({
        message: `Bạn không có quyền truy cập.`,
        description: "Vui lòng liên hệ người quản lý !",
      });
      return router.navigate("/login");
    }

    return Promise.reject(error);
  }
);

export default instance;
