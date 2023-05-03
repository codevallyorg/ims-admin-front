import { IAction } from './IAction';
import { IUser } from './IUser';

export type RoleSelectOptions = {
  value: number;
  label: string;
};

export type RoleActions = {
  id: number;
  roleId: number;
  actionId: number;
  action: IAction;
  needsApproval: true;
  createdAt: string;
  updatedAt: string;
};

export type IRole = {
  id: number;
  name: string;
  description: string;
  protected: boolean;
  archived: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  needsApprovalFrom: number[];
  users: IUser[];
  RoleActions: RoleActions[];
};
