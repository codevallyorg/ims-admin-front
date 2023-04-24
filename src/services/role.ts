import {
  createRole,
  editRole,
  getAllRoles,
  getRole,
  getRoleSelectOptions,
} from '@/apis/role';
import { CreateRolePayload, EditRolePayload } from '@/types/payloads/role';

export default class Role {
  static async getRoleSelectOptions() {
    const { data } = await getRoleSelectOptions();
    return data;
  }

  static async createRole(payload: CreateRolePayload) {
    const { data } = await createRole(payload);
    return data;
  }

  static async getAllRoles() {
    const { data } = await getAllRoles();
    return data;
  }

  static async getRole(id: number) {
    const { data } = await getRole(id);
    return data;
  }

  static async editRole(id: number, payload: EditRolePayload) {
    const { data } = await editRole(id, payload);
    return data;
  }
}
