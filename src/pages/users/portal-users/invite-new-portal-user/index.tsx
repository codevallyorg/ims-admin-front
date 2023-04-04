import { FC, useState } from 'react';

import { InvitePortalUserPayload } from '@/types/payloads/user';
import User from '@/services/user';
import { useRouter } from 'next/router';
import { ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';
import { withLayout } from '@/components/layout/utils';
import Private from '@/components/layout/Private';
import PortalUserForm from '@/components/pages/forms/portal-user/PortalUserForm';

const InviteNewPortalUser: FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const onSubmit = async (data: InvitePortalUserPayload) => {
    try {
      setSubmitting(true);

      // TO DELETE
      // @ts-ignore
      data.type = 'Portal';

      await User.invitePortalUser(data);

      router.push(ROUTE_DASHBOARD_PORTAL_USERS);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return <PortalUserForm loading={submitting} onSubmit={onSubmit} />;
};

export default withLayout(InviteNewPortalUser, Private);
