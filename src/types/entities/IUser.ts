export enum UserType {
  Portal = 'Portal',
  TDR = 'TDR',
  Archived = 'Archived',
}

export enum UserStatus {
  Invited = 'Invited',
  LoggedIn = 'LoggedIn',
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
  role: {
    name: string;
  };
};

type ITDRProfile = {
  id: number;
  mobile?: string;
  location?: string;
  nationality?: string;
  idNumber?: string;
  createdAt: string;
  updatedAt: string;
};
