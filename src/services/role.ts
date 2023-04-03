import { getRoleSelectOptions } from '@/apis/role';

export default class Role {
  static async getRoleSelectOptions() {
    const { data } = await getRoleSelectOptions();
    return data;
  }
}
