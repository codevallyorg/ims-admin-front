import { LoginPayload } from '@/types/payloads/auth';
import { endpointUrl } from '@/utils/general';
import axiosInstance from './axios';

export const login = (payload: LoginPayload) => {
  return axiosInstance.post(endpointUrl('auth/login'), payload);
};

export const whoAmI = () => {
  return axiosInstance.get(endpointUrl('auth/whoAmI'));
};
