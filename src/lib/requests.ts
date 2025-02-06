import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

// Create an Axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // ..  Add any headers you want
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.status, error.response.data);
    }
    return Promise.reject(error);
  }
);

// Typed request functions
export const get = <T>(url: string, params?: object): Promise<AxiosResponse<T>> =>
  api.get<T>(url, { params });

export const post = <T>(url: string, data?: object): Promise<AxiosResponse<T>> =>
  api.post<T>(url, data);

export const put = <T>(url: string, data?: object): Promise<AxiosResponse<T>> =>
  api.put<T>(url, data);

export const del = <T>(url: string): Promise<AxiosResponse<T>> => api.delete<T>(url);

export default api;
