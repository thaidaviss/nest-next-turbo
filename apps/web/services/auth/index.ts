import { AuthAPI } from '@/api';
import { useState } from 'react';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '../axiosClient';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { SITE_MAP } from '@/constants';

const setLoginSuccess = (data: any) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.data.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.data.refresh_token);
};

export const useAuth = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthAPI.login({ username, password });
      if (data.statusCode == 200) {
        setLoginSuccess( data );
        router.push(SITE_MAP.HOME);
      } else {
        setError(data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred during login');
      } else {
        setError('An unexpected error occurred');
      }
      return false;
    }

    setLoading(false);
  };

  const register = async (body: { username: string; password: string; email: string }) => {
    setLoading(true);
    setError(null);
    try {
      const data = await AuthAPI.register(body);
      console.log("🚀 ~ register ~ data:", data)
      if (data.statusCode == 201) {
        setLoginSuccess(data);
        router.push(SITE_MAP.LOGIN);
      } else {
        setError(data.message);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'An error occurred during login');
      } else {
        setError('An unexpected error occurred');
      }
      return false;
    }

    setLoading(false);
  };

  //
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    //TODO: do something to logout
    router.push(SITE_MAP.LOGIN);
  };
  return {
    login,
    register,
    logout,
    loading,
    error,
  };
};
