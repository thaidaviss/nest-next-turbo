import { axiosClient } from '@/services/axiosClient';
import { Response } from '@/types/response.type';

import { AxiosResponse } from 'axios';
interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  refetchToken: string;
}
export const AuthAPI = {
  login: (payload: LoginPayload) =>
    axiosClient.post<undefined, Response<LoginResponse>>(`/login`, payload),
  register: (payload: { username: string; password: string; email: string }) =>
    axiosClient.post<undefined, Response<LoginResponse>>(`/register`, payload),
  me: () => axiosClient.get(`/me`),
  refreshToken: (payload: { refreshToken: string }) =>
    axiosClient.post(`/refetch-token`, payload, { headers: { hasAuthorization: false } }),
};
