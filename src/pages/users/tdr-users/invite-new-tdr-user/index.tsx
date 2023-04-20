import { FC, useState } from 'react';

import { InviteTDRUserPayload } from '@/types/payloads/user';
import User from '@/services/user';
import { useRouter } from 'next/router';
import { withLayout } from '@/components/layout/utils';
import Private from '@/components/layout/Private';
import { UserAddOutlined } from '@ant-design/icons';
import { PRIMARY_BLUE } from '@/utils/colors';
import { showErrorNotification, showNotification } from '@/utils/general';
import TDRUserForm from '@/components/pages/forms/tdr-user/TDRUserForm';
import { UserType } from '@/types/entities/IUser';
import { defaultStyle, ROUTE_DASHBOARD_TDR_USERS } from '@/utils/constants';

const InviteNewTDRUser: FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const router = useRouter();

  const onSubmit = async (data: InviteTDRUserPayload) => {
    try {
      setSubmitting(true);

      // TO DELETE
      // @ts-ignore
      data.type = UserType.TDR;

      data.mobile = `${data.mobile}`;

      const newUser = await User.inviteNewUser(data);

      router.push(`${ROUTE_DASHBOARD_TDR_USERS}/${newUser.id}`);

      showNotification({
        message: 'New TDR User Invite Sent',
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
      <TDRUserForm loading={submitting} onSubmit={onSubmit} />;
    </div>
  );
};

export default withLayout(InviteNewTDRUser, Private);
