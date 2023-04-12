import {
  archiveUserProfile,
  editPortalUser,
  getAllUsers,
  getUser,
  inviteNewUser,
  resetPassword,
  toggleUserProfileLock,
} from '@/apis/user';
import { PaginationOptions } from '@/types/payloads/pagination';
import {
  EditPortalUserPayload,
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

  static async editPortalUser(id: number, payload: EditPortalUserPayload) {
    const { data } = await editPortalUser(id, payload);
    return data;
  }

  static async resetPassword(id: number) {
    const { data } = await resetPassword(id);
    return data;
  }

  static async archiveUserProfile(id: number) {
    const { data } = await archiveUserProfile(id);
    return data;
  }

  static async toggleUserProfileLock(id: number) {
    const { data } = await toggleUserProfileLock(id);
    return data;
  }
}
