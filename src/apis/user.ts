import { PaginationOptions } from '@/types/payloads/pagination';
import {
  EditPortalUserPayload,
  InvitePortalUserPayload,
  InviteTDRUserPayload,
} from '@/types/payloads/user';
import { endpointUrl, getPaginatedUrl } from '@/utils/general';
import axiosInstance from './axios';

export const inviteNewUser = (
  payload: InvitePortalUserPayload | InviteTDRUserPayload,
) => {
  return axiosInstance.post(endpointUrl('users'), payload);
};

export const getAllUsers = (pageOptions: PaginationOptions) => {
  return axiosInstance.get(getPaginatedUrl(`users`, pageOptions));
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

export const archiveUserProfile = (id: number) => {
  return axiosInstance.patch(endpointUrl(`users/archive/${id}`));
};

export const toggleUserProfileLock = (id: number) => {
  return axiosInstance.patch(endpointUrl(`users/toggle-locked/${id}`));
};
