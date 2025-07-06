import { AuthAPI, BASE_URL } from '@/api';
import { SITE_MAP } from '@/constants';
import axios from 'axios';

const TIMEOUT_REQUEST = 10000;
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT_REQUEST,
  headers: {
    'Content-Type': 'application/json',
    hasAuthorization: true,
  },
});

const refetchToken = async () => {
  const refetchToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refetchToken) {
    return null;
  }
  const response = await AuthAPI.refreshToken({
    refreshToken: refetchToken,
  });

  if (response.data.token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.data.token);
    return response.data.token;
  }
  return null;
};

// Add a request interceptor to axiosClient
axiosClient.interceptors.request.use(config => {
  // Add the Authorization header to the request if the hasAuthorization flag is true
  if (config?.headers?.hasAuthorization()) {
    // Get the access token from localStorage
    const access_token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!access_token) {
      // Redirect the user to the login page if the token is not available
      location.href = SITE_MAP.LOGIN;
    }
    // Add the access token to the Authorization header
    config.headers.Authorization = `Bearer ${access_token}`;
  } else {
    // Remove the Authorization header if the hasAuthorization flag is false
    delete config.headers.Authorization;
  }
  return config;
});

// Add a response interceptor to axiosClient
axiosClient.interceptors.response.use(
  async response => {
    // If the response status is 401, it means the token is invalid
    if (response.status === 401) {
      // Remove the access token from localStorage
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      // Refetch the token
      const newToken = await refetchToken();
      if (newToken) {
        // Update the Authorization header with the new token
        response.config.headers.Authorization = `Bearer ${newToken}`;
        // Return the axiosClient with the new token
        return axiosClient(response.config);
      }
      // Redirect the user to the login page if the token is invalid
      location.href = SITE_MAP.LOGIN;
    }
    // Return the response if the status is not 401
    return response.data;
  },
  error => {
    return error.response.data;
  },
);

export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, axiosClient };
