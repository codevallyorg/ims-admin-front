import { useRouter } from 'next/router';
import { FC, PropsWithChildren, useEffect } from 'react';

import { useAuthContext } from '@/contexts/AuthProvider';
import { ROUTE_EXISTING_USER_LOGIN } from '@/utils/constants';

const Private: FC<PropsWithChildren<{}>> = ({ children }) => {
  const { user, authLoading } = useAuthContext();

  const router = useRouter();

  useEffect(() => {
    if (!user && !authLoading) router.replace(ROUTE_EXISTING_USER_LOGIN);
  }, [user, authLoading, router]);

  return <>{user && !authLoading && children}</>;
};

export default Private;
