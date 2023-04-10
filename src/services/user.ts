import {
  archiveUserProfile,
  editPortalUser,
  getAllPortalUsers,
  getUser,
  invitePortalUser,
  resetPassword,
  toggleUserProfileLock,
} from '@/apis/user';
import { UserType } from '@/types/entities/IUser';
import { PaginationOptions } from '@/types/payloads/pagination';
import {
  EditPortalUserPayload,
  InvitePortalUserPayload,
} from '@/types/payloads/user';

export default class User {
  static async invitePortalUser(payload: InvitePortalUserPayload) {
    const { data } = await invitePortalUser(payload);
    return data;
  }

  static async getAllPortalUsers(paginationOptions: PaginationOptions) {
    paginationOptions.filterByType = UserType.Portal;

    const { data } = await getAllPortalUsers(paginationOptions);
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
