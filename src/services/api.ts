import axios, {
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from 'axios';
import { toast } from 'react-toastify';
import { BASE_API_URL } from '@/constants';
import { AUTH_TOKEN_KEY } from '@/constants/local-storage-keys';
import { getStorage } from '@/lib/local-storage';

declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    withAuth?: boolean;
  }
}
 
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  withAuth?: boolean;
}
 
const api = axios.create({
  baseURL: BASE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
 
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStorage(AUTH_TOKEN_KEY);
    const customConfig = config as CustomAxiosRequestConfig;
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData;
 
    config.headers = config.headers || {};
 
    if (!isFormData && !('Content-Type' in config.headers)) {
      config.headers['Content-Type'] = 'application/json';
    }
 
    if (customConfig.withAuth && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      if ('Authorization' in config.headers) {
        delete config.headers['Authorization'];
      }
    }
 
    return config;
  },
  (error) => Promise.reject(error),
);
 
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error(error.response);
    }
    return Promise.reject(error);
  },
);
 
const apiService = {
  get: <T>(url: string, config?: CustomAxiosRequestConfig): Promise<{ data: T; status: number }> =>
    api.get<T>(url, config).then((res) => ({
      data: res.data,
      status: res.status,
    })),
 
  post: <T>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<{ data: T; status: number }> =>
    api.post<T>(url, data, config).then((res) => ({
      data: res.data,
      status: res.status,
    })),
 
  put: <T>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<{ data: T; status: number }> =>
    api.put<T>(url, data, config).then((res) => ({
      data: res.data,
      status: res.status,
    })),
 
  delete: <T>(url: string, config?: CustomAxiosRequestConfig): Promise<{ data: T; status: number }> =>
    api.delete<T>(url, config).then((res) => ({
      data: res.data,
      status: res.status,
    })),
 
  patch: <T>(url: string, data?: any, config?: CustomAxiosRequestConfig): Promise<{ data: T; status: number }> =>
    api.patch<T>(url, data, config).then((res) => ({
      data: res.data,
      status: res.status,
    })),
};
 
export default apiService;