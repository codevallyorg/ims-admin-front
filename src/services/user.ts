import {
  editPortalUser,
  getAllPortalUsers,
  getPortalUser,
  invitePortalUser,
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

  static async getPortalUser(id: number) {
    const { data } = await getPortalUser(id);
    return data;
  }

  static async editPortalUser(id: number, payload: EditPortalUserPayload) {
    const { data } = await editPortalUser(id, payload);
    return data;
  }
}
