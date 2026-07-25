import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';
import { API_BASE_URL } from './config';

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function apiErrorMessage(err) {
  if (!err) {
    return 'Something went wrong. Please try again.';
  }

  if (err.response) {
    const backendError = err.response.data?.error;
    if (backendError) {
      return backendError;
    }
    return `Request failed with status ${err.response.status}`;
  }

  if (err.request) {
    return 'Unable to reach the server. Please check your network or backend address.';
  }

  return err.message || 'Something went wrong. Please try again.';
}
