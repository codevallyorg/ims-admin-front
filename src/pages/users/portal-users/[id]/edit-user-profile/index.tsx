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
import { useBreadcrumbContext } from '@/contexts/BreadcrumbProvider';

const EditUserProfile: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [portalUser, setPortalUser] = useState<IUser>();

  const { setBreadcrumbNameMap } = useBreadcrumbContext();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const loadPortalUserData = async () => {
      try {
        if (!id) return;

        setLoading(true);

        const user = await User.getPortalUser(+id);

        const key = `${ROUTE_DASHBOARD_PORTAL_USERS}/${id}`;
        const value = `${user.firstName} ${user.lastName}`;

        const keyForEdit = `${ROUTE_DASHBOARD_PORTAL_USERS}/${id}/edit-user-profile`;
        const valueForEdit = `Edit User Profile`;

        setBreadcrumbNameMap((curMap) => {
          const newNameMap = { ...curMap };
          newNameMap[key] = value;
          newNameMap[keyForEdit] = valueForEdit;

          return newNameMap;
        });

        setPortalUser(user);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPortalUserData();
  }, [id, setBreadcrumbNameMap]);

  const onSubmit = async (data: EditPortalUserPayload) => {
    try {
      if (!id) return;

      setSubmitting(true);

      await User.editPortalUser(+id, data);

      router.push(ROUTE_DASHBOARD_PORTAL_USERS);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <PortalUserForm
      loading={submitting}
      defaultValues={portalUser}
      onSubmit={onSubmit}
    />
  );
};

export default withLayout(EditUserProfile, Private);
