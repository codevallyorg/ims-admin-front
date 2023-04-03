import { invitePortalUser } from '@/apis/user';
import { InvitePortalUserPayload } from '@/types/payloads/user';

export default class User {
  static async invitePortalUser(payload: InvitePortalUserPayload) {
    const { data } = await invitePortalUser(payload);
    return data;
  }
}
