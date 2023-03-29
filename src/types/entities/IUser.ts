export enum UserType {
  Portal,
  TDR,
}

export enum UserStatus {
  Invited,
  LoggedIn,
}

export type IUser = {
  id: number;
  type: UserType;
  status: UserStatus;
  email: string;
  firstName: string;
  lastName: string;
  roleId: number;
  locked: boolean;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
  tdrProfile?: ITDRProfile;
};

type ITDRProfile = {
  id: number;
  location?: string;
  nationality?: string;
  idNumber?: string;
  createdAt: string;
  updatedAt: string;
};
