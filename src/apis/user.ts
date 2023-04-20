import { PaginationOptions } from '@/types/payloads/pagination';
import {
  EditPortalUserPayload,
  EditTDRUserPayload,
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

export const getAllUsers = (
  pageOptions: PaginationOptions,
  archived: boolean,
) => {
  return axiosInstance.get(
    getPaginatedUrl(`${archived ? 'users/archived' : 'users'}`, pageOptions),
  );
};

export const getUser = (id: number) => {
  return axiosInstance.get(endpointUrl(`users/${id}`));
};

export const editUser = (
  id: number,
  payload: EditPortalUserPayload | EditTDRUserPayload,
) => {
  return axiosInstance.patch(endpointUrl(`users/${id}`), payload);
};

export const resetPassword = (id: number) => {
  return axiosInstance.post(endpointUrl(`users/reset-password/${id}`));
};

export const toggleUserProfileLock = (id: number) => {
  return axiosInstance.patch(endpointUrl(`users/toggle-locked/${id}`));
};

export const toggleArchiveUserProfile = (id: number) => {
  return axiosInstance.patch(endpointUrl(`users/toggle-archived/${id}`));
};

export const reassignRole = (userIds: number[], roleId: number) => {
  return axiosInstance.patch(endpointUrl('users/reassign-role'), {
    userIds,
    roleId,
  });
};
