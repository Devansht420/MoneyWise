import axios from "axios";
import { BASE_URL } from "./url";

// shared client: base url + auth header + refresh on 401
export const http = axios.create({ baseURL: BASE_URL });

const PUBLIC_PATHS = ["/users/login", "/users/register", "/users/refresh-token"];

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("userInfo") || "null");
  } catch {
    return null;
  }
}

http.interceptors.request.use((config) => {
  const path = config.url || "";
  const isPublic = PUBLIC_PATHS.some((p) => path.startsWith(p));
  if (isPublic) return config;

  const user = readUser();
  const access = user?.accessToken || user?.token;
  if (access) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

http.interceptors.response.use(
  (res) => res,
  async (error) => {
    const cfg = error.config;
    if (
      !cfg ||
      error.response?.status !== 401 ||
      cfg._retry ||
      PUBLIC_PATHS.some((p) => (cfg.url || "").startsWith(p))
    ) {
      return Promise.reject(error);
    }

    cfg._retry = true;
    const user = readUser();
    const refreshToken = user?.refreshToken;
    if (!refreshToken) {
      localStorage.removeItem("userInfo");
      return Promise.reject(error);
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/users/refresh-token`, {
        refreshToken,
      });
      const next = { ...user, accessToken: data.accessToken };
      localStorage.setItem("userInfo", JSON.stringify(next));
      window.dispatchEvent(new Event("moneywise:auth-refresh"));
      return http(cfg);
    } catch {
      localStorage.removeItem("userInfo");
      return Promise.reject(error);
    }
  }
);
