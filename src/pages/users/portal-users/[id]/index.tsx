import { FC, useEffect, useState } from 'react';
import PortalUserForm from '@/components/pages/forms/portal-user/PortalUserForm';
import { useRouter } from 'next/router';
import User from '@/services/user';
import { IUser } from '@/types/entities/IUser';
import Loader from '@/components/ui/loader/Loader';
import { withLayout } from '@/components/layout/utils';
import Private from '@/components/layout/Private';
import { useBreadcrumbContext } from '@/contexts/BreadcrumbProvider';
import { ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';

const ViewUserProfile: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
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

        setBreadcrumbNameMap((curMap) => {
          const newNameMap = { ...curMap };
          newNameMap[key] = value;

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

  if (loading) {
    return <Loader />;
  }

  return <PortalUserForm readOnly defaultValues={portalUser} />;
};

export default withLayout(ViewUserProfile, Private);
