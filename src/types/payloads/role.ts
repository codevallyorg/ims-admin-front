export type RoleActionsPayload = {
  actionId: number;
  needsApproval: boolean;
};

export type CreateRolePayload = {
  name: string;
  description?: string;
  needsApprovalFrom: number[];
  RoleActions?: RoleActionsPayload[];
};
