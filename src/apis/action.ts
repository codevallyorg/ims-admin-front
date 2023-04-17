import { endpointUrl } from '@/utils/general';
import axiosInstance from './axios';

export const getAllActions = () => {
  return axiosInstance.get(endpointUrl('actions'));
};
