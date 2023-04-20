import { IUser } from './IUser';

export type RoleSelectOptions = {
  value: number;
  label: string;
};

export type IRole = {
  id: number;
  name: string;
  description: string;
  archived: boolean;
  createdBy: number;
  updatedBy: number;
  createdAt: string;
  updatedAt: string;
  needsApprovalFrom: number[];
  users: IUser[];
};
