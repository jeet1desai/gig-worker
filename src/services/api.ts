import { BASE_API_URL } from '@/constants';
import { AUTH_TOKEN_KEY } from '@/constants/local-storage-keys';
import { getStorage } from '@/lib/local-storage';
import axios, {
  AxiosHeaders,
  AxiosRequestConfig,
  InternalAxiosRequestConfig
} from 'axios';
import { toast } from '@/lib/toast';
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  withAuth?: boolean;
}

interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  withAuth?: boolean;
}

const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config): InternalAxiosRequestConfig => {
    const token = getStorage(AUTH_TOKEN_KEY);

    // Safely cast to custom type to access withAuth
    const customConfig = config as CustomAxiosRequestConfig;

    if (customConfig.withAuth && token && config.headers instanceof AxiosHeaders) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;

    if (
      config.headers instanceof AxiosHeaders &&
      !isFormData &&
      !config.headers.has('Content-Type')
    ) {
      config.headers.set('Content-Type', 'application/json');
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error(error.response);
    }
    return Promise.reject(error);
  }
);

const apiService = {
  get: <T>(
    url: string,
    config?: CustomAxiosRequestConfig
  ): Promise<{ data: T; status: number }> =>
    api.get<T>(url, config).then((res) => ({
      data: res.data,
      status: res.status
    })),

  post: <T>(
    url: string,
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<{ data: T; status: number }> =>
    api.post<T>(url, data, config).then((res) => ({
      data: res.data,
      status: res.status
    })),

  put: <T>(
    url: string,
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<{ data: T; status: number }> =>
    api.put<T>(url, data, config).then((res) => ({
      data: res.data,
      status: res.status
    })),

  delete: <T>(
    url: string,
    config?: CustomAxiosRequestConfig
  ): Promise<{ data: T; status: number }> =>
    api.delete<T>(url, config).then((res) => ({
      data: res.data,
      status: res.status
    })),

  patch: <T>(
    url: string,
    data?: any,
    config?: CustomAxiosRequestConfig
  ): Promise<{ data: T; status: number }> =>
    api.patch<T>(url, data, config).then((res) => ({
      data: res.data,
      status: res.status
    }))
};

export default apiService;
