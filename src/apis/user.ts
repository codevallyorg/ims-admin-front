import { InvitePortalUserPayload } from '@/types/payloads/user';
import { endpointUrl } from '@/utils/general';
import axiosInstance from './axios';

export const invitePortalUser = (payload: InvitePortalUserPayload) => {
  return axiosInstance.post(endpointUrl('users'), payload);
};
