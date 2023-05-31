import axios from "axios";
import history from "./history";
import _ from "lodash";
import { LOCAL_STORAGE } from "constants/localstorage";
export class HttpClient {
  axiosInstance;

  constructor() {
    const tokenAccess = localStorage.getItem(LOCAL_STORAGE.ACCESS_TOKEN);
    let configs = {
      baseURL: process.env.REACT_APP_API_ENDPOINT3,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: "Bearer " + tokenAccess,
      },
      timeout: 50000,
      transformRequest: [
        (data, headers) => {
          if (data instanceof FormData) {
            if (headers) {
              delete headers["Content-Type"];
            }
            return data;
          }
          return JSON.stringify(data);
        },
      ],
    };
    this.axiosInstance = axios.create(configs);
    this.axiosInstance.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        const config = error.config;
        const status = error?.response?.status;
        if (config.url.includes("/auth/refresh-token")) {
          return Promise.reject(error);
        }
        const oldRefreshToken = localStorage.getItem(
          LOCAL_STORAGE.REFESH_TOKEN
        );
        if (status === 401 && !config.__isRetryRequest) {
          try {
            const res = await this.axiosInstance.post("/auth/refresh-token", {
              refreshToken: oldRefreshToken,
            });
            const data = _.get(res, "data.data");
            const { accessToken, refreshToken } = data;
            localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, accessToken);
            localStorage.setItem(LOCAL_STORAGE.REFESH_TOKEN, refreshToken);
            config.headers["Authorization"] = "Bearer " + accessToken;
            config.__isRetryRequest = true;
            return this.axiosInstance(config);
          } catch (err) {
            localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
            localStorage.removeItem(LOCAL_STORAGE.REFESH_TOKEN);
            history.push("/login");
            return null;
          }
        }
        return Promise.reject(error);
      }
    );
  }
}
