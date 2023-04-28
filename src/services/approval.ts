import { approveRequest, getAllRequests, rejectRequest } from '@/apis/approval';
import { ApprovalStatus } from '@/types/entities/IUserActionsApproval';

export default class Approval {
  static async getAllRequests(status: ApprovalStatus) {
    const { data } = await getAllRequests(status);
    return data;
  }

  static async approveRequest(id: number, notes: string) {
    const { data } = await approveRequest(id, notes);
    return data;
  }

  static async rejectRequest(id: number, notes: string) {
    const { data } = await rejectRequest(id, notes);
    return data;
  }
}
