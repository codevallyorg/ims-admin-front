import {
  editPortalUser,
  getAllPortalUsers,
  getUser,
  invitePortalUser,
  resetPassword,
  updatePassword,
} from '@/apis/user';
import {
  EditPortalUserPayload,
  InvitePortalUserPayload,
} from '@/types/payloads/user';

export default class User {
  static async invitePortalUser(payload: InvitePortalUserPayload) {
    const { data } = await invitePortalUser(payload);
    return data;
  }

  static async getAllPortalUsers() {
    const { data } = await getAllPortalUsers();
    return data;
  }

  static async getUser(id: number) {
    const { data } = await getUser(id);
    return data;
  }

  static async editPortalUser(id: number, payload: EditPortalUserPayload) {
    const { data } = await editPortalUser(id, payload);
    return data;
  }

  static async resetPassword(id: number) {
    const { data } = await resetPassword(id);
    return data;
  }

  static async updatePassword(id: number, password: string) {
    const { data } = await updatePassword(id, password);
    return data;
  }
}
