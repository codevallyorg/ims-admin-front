import { endpointUrl } from '@/utils/general';
import axiosInstance from './axios';

export const getRoleSelectOptions = () => {
  return axiosInstance.get(endpointUrl('roles/select-options'));
};
