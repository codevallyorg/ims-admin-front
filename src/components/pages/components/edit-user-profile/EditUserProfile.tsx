import { FC, useState } from 'react';
import { useRouter } from 'next/router';

import PortalUserForm from '@/components/pages/forms/portal-user/PortalUserForm';
import User from '@/services/user';
import Loader from '@/components/ui/loader/Loader';
import {
  EditPortalUserPayload,
  EditTDRUserPayload,
} from '@/types/payloads/user';
import {
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
} from '@/utils/constants';
import { showErrorNotification, showNotification } from '@/utils/general';
import { BellOutlined } from '@ant-design/icons';
import { PRIMARY_BLUE } from '@/utils/colors';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import { UserType } from '@/types/entities/IUser';
import TDRUserForm from '../../forms/tdr-user/TDRUserForm';

type EditUserProfileProps = {
  userType: UserType;
};

const EditUserProfile: FC<EditUserProfileProps> = ({ userType }) => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { loadingPageHeader, selectedUser, getSelectedUser } =
    usePageHeaderContext();
  const router = useRouter();

  const onSubmit = async (data: EditPortalUserPayload | EditTDRUserPayload) => {
    try {
      if (!selectedUser || !selectedUser.id) return;

      setSubmitting(true);

      await User.editUser(+selectedUser.id, data);

      getSelectedUser();

      const url =
        userType === UserType.Portal
          ? ROUTE_DASHBOARD_PORTAL_USERS
          : ROUTE_DASHBOARD_TDR_USERS;

      router.push(url);
      showNotification({
        message: `${userType} User Update`,
        description: `${data.firstName} ${data.lastName}'s user profile has been updated.`,
        icon: <BellOutlined style={{ color: PRIMARY_BLUE }} />,
      });
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingPageHeader) {
    return <Loader />;
  }

  return userType === UserType.Portal ? (
    <PortalUserForm
      loading={submitting}
      defaultValues={selectedUser || undefined}
      onSubmit={onSubmit}
    />
  ) : (
    <TDRUserForm
      loading={submitting}
      defaultValues={selectedUser || undefined}
      onSubmit={onSubmit}
    />
  );
};

export default EditUserProfile;
