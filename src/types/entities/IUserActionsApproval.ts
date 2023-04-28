import { IUser } from './IUser';
import { IUserActions } from './IUserActions';

export enum ApprovalStatus {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

export type IUserActionsApproval = {
  id: number;
  userAction: IUserActions;
  userActionId: number;
  //   approvalFromRole: IRole;
  //   approvalFromRoleId: number;
  //   approvedByUser: IUser | null;
  target?: IUser;
  approvedByUserId: number | null;
  approvedAt: string | null;
  notes: string | null;
  status: ApprovalStatus;
  createdAt: string;
  updatedAt: string;
};
