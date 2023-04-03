import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useEffect } from 'react';

import { useAuthContext } from '@/contexts/AuthProvider';
import { ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';

const Public: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { user, authLoading } = useAuthContext();

  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) router.replace(ROUTE_DASHBOARD_PORTAL_USERS);
  }, [user, authLoading, router]);

  return <>{!user && !authLoading && children}</>;
};

export default Public;
