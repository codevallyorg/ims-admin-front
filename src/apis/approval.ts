import { ApprovalStatus } from '@/types/entities/IUserActionsApproval';
import { endpointUrl } from '@/utils/general';
import axiosInstance from './axios';

export const getAllRequests = (status: ApprovalStatus) => {
  return axiosInstance.get(
    endpointUrl(`approvals/requests?filterByStatus=${status}`),
  );
};

export const approveRequest = (id: number, notes: string) => {
  return axiosInstance.patch(endpointUrl(`approvals/${id}/approve`), {
    notes,
  });
};

export const rejectRequest = (id: number, notes: string) => {
  return axiosInstance.patch(endpointUrl(`approvals/${id}/reject`), {
    notes,
  });
};
