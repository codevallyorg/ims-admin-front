import {
  archiveUserProfile,
  editUser,
  getAllUsers,
  getUser,
  inviteNewUser,
  resetPassword,
  toggleUserProfileLock,
} from '@/apis/user';
import { PaginationOptions } from '@/types/payloads/pagination';
import {
  EditPortalUserPayload,
  EditTDRUserPayload,
  InvitePortalUserPayload,
  InviteTDRUserPayload,
} from '@/types/payloads/user';

export default class User {
  static async inviteNewUser(
    payload: InvitePortalUserPayload | InviteTDRUserPayload,
  ) {
    const { data } = await inviteNewUser(payload);
    return data;
  }

  static async getAllUsers(paginationOptions: PaginationOptions) {
    const { data } = await getAllUsers(paginationOptions);
    return data;
  }

  static async getUser(id: number) {
    const { data } = await getUser(id);
    return data;
  }

  static async editUser(
    id: number,
    payload: EditPortalUserPayload | EditTDRUserPayload,
  ) {
    const { data } = await editUser(id, payload);
    return data;
  }

  static async resetPassword(id: number) {
    const { data } = await resetPassword(id);
    return data.data;
  }

  static async archiveUserProfile(id: number) {
    const { data } = await archiveUserProfile(id);
    return data.data;
  }

  static async toggleUserProfileLock(id: number) {
    const { data } = await toggleUserProfileLock(id);
    return data;
  }
}
