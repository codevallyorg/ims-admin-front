export type InvitePortalUserPayload = {
  firstName: string;
  lastName: string;
  email: string;
  roleId: number;
};

export type EditPortalUserPayload = {
  firstName?: string;
  lastName?: string;
  email?: string;
  roleId?: number;
};

export type InviteTDRUserPayload = InvitePortalUserPayload & {
  mobile: number | string;
  location?: string;
  nationality?: string;
  idNumber?: string;
};
