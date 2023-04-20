import { FC, useState } from 'react';

import { InvitePortalUserPayload } from '@/types/payloads/user';
import User from '@/services/user';
import { useRouter } from 'next/router';
import { defaultStyle, ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';
import { withLayout } from '@/components/layout/utils';
import Private from '@/components/layout/Private';
import PortalUserForm from '@/components/pages/forms/portal-user/PortalUserForm';
import { UserAddOutlined } from '@ant-design/icons';
import { PRIMARY_BLUE } from '@/utils/colors';
import { showErrorNotification, showNotification } from '@/utils/general';
import { UserType } from '@/types/entities/IUser';

const InviteNewPortalUser: FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const onSubmit = async (data: InvitePortalUserPayload) => {
    try {
      setSubmitting(true);

      // TO DELETE
      // @ts-ignore
      data.type = UserType.Portal;

      await User.inviteNewUser(data);

      router.push(ROUTE_DASHBOARD_PORTAL_USERS);

      showNotification({
        message: 'New Portal User Invite Sent',
        description: `An invite has been sent to ${data.firstName} ${data.lastName}.`,
        icon: <UserAddOutlined style={{ color: PRIMARY_BLUE }} />,
      });
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={defaultStyle}>
      <PortalUserForm loading={submitting} onSubmit={onSubmit} />;
    </div>
  );
};

export default withLayout(InviteNewPortalUser, Private);
