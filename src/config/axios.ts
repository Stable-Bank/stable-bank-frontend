import { ApiError, RefreshResponse } from "@/types/api";
import axios, {
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";

export const getApiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_API_URL || "";
  if (typeof window !== "undefined") {
    // If the client page is served over HTTPS (e.g. https://stablebank.finance)
    // NEVER allow insecure http:// requests to prevent browser Mixed Content blocking.
    if (window.location.protocol === "https:") {
      if (!url || url.includes("46.224.93.94") || url.startsWith("http://")) {
        return "https://api.stablebank.finance/api/v1";
      }
    }
  }
  return url || "https://api.stablebank.finance/api/v1";
};

export const getBackendOrigin = (): string => {
  const base = getApiBaseUrl();
  return base.replace(/\/api\/v1\/?$/, "");
};

const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 20000,
  headers: {},
});

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeTokenRefresh = (cb: (token: string) => void): void => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token: string): void => {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
};

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (typeof window !== "undefined" && window.location.protocol === "https:") {
      if (!config.baseURL || config.baseURL.startsWith("http://")) {
        config.baseURL = getApiBaseUrl();
      }
      if (config.url && config.url.startsWith("http://")) {
        config.url = config.url
          .replace("http://46.224.93.94:4000", "https://api.stablebank.finance")
          .replace(/^http:\/\//i, "https://");
      }
    }
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Extract data from nested response structure if present
    // Handle both { status: "success", data: {...} } and { success: true, data: {...} }
    if (
      (response.data?.status === "success" || response.data?.success === true) &&
      response.data?.data
    ) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  async (
    error: AxiosError<{ message: string; status: number }>
  ): Promise<any> => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle network errors
    if (!error.response) {
      const apiError: ApiError = {
        message: "Network error. Please check your connection.",
        status: 0,
        code: "NETWORK_ERROR",
      };
      return Promise.reject(apiError);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't try to refresh token for login/register endpoints
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                            originalRequest.url?.includes('/auth/register');
      
      if (isAuthEndpoint) {
        const apiError: ApiError = {
          message: error.response?.data?.message || "Invalid credentials. Please check your email and password.",
          status: error.response?.data?.status || error.response?.status,
          code: error.response?.status,
        };
        return Promise.reject(apiError);
      }

      if (isRefreshing) {
        return new Promise<AxiosResponse>((resolve) => {
          subscribeTokenRefresh((token: string) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        if (!refreshToken) {
          throw new Error("Session expired. Please login again.");
        }

        const response = await axios.post<{
          status: string;
          data: RefreshResponse;
        }>(`${getApiBaseUrl()}/auth/refresh`, { refreshToken });

        const { accessToken, refreshToken: newRefreshToken } =
          response.data.data;

        localStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }

        isRefreshing = false;
        onRefreshed(accessToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch {
        isRefreshing = false;
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        window.dispatchEvent(new CustomEvent("auth:logout"));

        const apiError: ApiError = {
          message: "Session expired. Please login again.",
          status: 401,
          code: 401,
        };
        return Promise.reject(apiError);
      }
    }

    const apiError: ApiError = {
      message:
        error.response?.data?.message || error.message || "An error occurred",
      status: error.response?.data?.status || error.response?.status,
      code: error.response?.status,
    };

    return Promise.reject(apiError);
  }
);

export const apiClient = {
  get: <T = any>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T> => api.get<T>(url, config).then((response) => response.data),

  post: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> =>
    api.post<T>(url, data, config).then((response) => response.data),

  put: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> =>
    api.put<T>(url, data, config).then((response) => response.data),

  delete: <T = any>(
    url: string,
    config?: InternalAxiosRequestConfig
  ): Promise<T> => api.delete<T>(url, config).then((response) => response.data),

  patch: <T = any>(
    url: string,
    data?: any,
    config?: InternalAxiosRequestConfig
  ): Promise<T> =>
    api.patch<T>(url, data, config).then((response) => response.data),
};
