import { UserType } from '@/types/entities/IUser';
import {
  EditPortalUserPayload,
  InvitePortalUserPayload,
} from '@/types/payloads/user';
import { endpointUrl } from '@/utils/general';
import axiosInstance from './axios';

export const invitePortalUser = (payload: InvitePortalUserPayload) => {
  return axiosInstance.post(endpointUrl('users'), payload);
};

export const getAllPortalUsers = () => {
  return axiosInstance.get(
    endpointUrl(`users?filterByType=${UserType.Portal}`),
  );
};

export const getUser = (id: number) => {
  return axiosInstance.get(endpointUrl(`users/${id}`));
};

export const editPortalUser = (id: number, payload: EditPortalUserPayload) => {
  return axiosInstance.patch(endpointUrl(`users/${id}`), payload);
};

export const resetPassword = (id: number) => {
  return axiosInstance.post(endpointUrl(`users/reset-password/${id}`));
};

export const updatePassword = (id: number, password: string) => {
  return axiosInstance.patch(endpointUrl(`users/update-password/${id}`), {
    password,
  });
};
