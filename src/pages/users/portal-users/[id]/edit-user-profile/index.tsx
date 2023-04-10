import { FC, useEffect, useState } from 'react';
import PortalUserForm from '@/components/pages/forms/portal-user/PortalUserForm';
import { useRouter } from 'next/router';
import User from '@/services/user';
import { IUser } from '@/types/entities/IUser';
import Loader from '@/components/ui/loader/Loader';
import { EditPortalUserPayload } from '@/types/payloads/user';
import { ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';
import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import { showErrorNotification, showNotification } from '@/utils/general';
import { BellOutlined } from '@ant-design/icons';
import { PRIMARY_BLUE } from '@/utils/colors';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';

const EditUserProfile: FC = () => {
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { loadingPageHeader, selectedUser, getSelectedUser } =
    usePageHeaderContext();
  const router = useRouter();

  const onSubmit = async (data: EditPortalUserPayload) => {
    try {
      if (!selectedUser || !selectedUser.id) return;

      setSubmitting(true);

      await User.editPortalUser(+selectedUser.id, data);

      getSelectedUser();
      router.push(ROUTE_DASHBOARD_PORTAL_USERS);
      showNotification({
        message: 'Portal User Update',
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

  return (
    <PortalUserForm
      loading={submitting}
      defaultValues={selectedUser || undefined}
      onSubmit={onSubmit}
    />
  );
};

export default withLayout(EditUserProfile, Private);
