import { CreateRolePayload } from '@/types/payloads/role';
import { endpointUrl } from '@/utils/general';
import axiosInstance from './axios';

export const getRoleSelectOptions = () => {
  return axiosInstance.get(endpointUrl('roles/select-options'));
};

export const createRole = (payload: CreateRolePayload) => {
  return axiosInstance.post(endpointUrl('roles'), payload);
};

export const getAllRoles = () => {
  return axiosInstance.get(endpointUrl('roles'));
};
