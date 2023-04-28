import { IAction } from './IAction';
import { IUser } from './IUser';

export enum ActionStatus {
  Pending = 'Pending',
  Completed = 'Completed',
  Cancelled = 'Cancelled',
  Failed = 'Failed',
}

export type IUserActions = {
  id: number;
  action: IAction;
  actionId: number;
  createdByUser: IUser;
  createdByUserId: number;
  notes: string | null;
  payload: any;
  status: ActionStatus;
  createdAt: string;
  updatedAt: string;
};
