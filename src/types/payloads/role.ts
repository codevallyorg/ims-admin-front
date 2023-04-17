export type RoleActions = {
  actionId: number;
  needsApproval: boolean;
};

export type CreateRolePayload = {
  name: string;
  description?: string;
  needsApprovalFrom: number[];
  actions: RoleActions[];
};
