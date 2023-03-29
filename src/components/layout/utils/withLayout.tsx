import { useAuthContext } from '@/contexts/AuthProvider';
import { FC, ReactNode } from 'react';
import SiderLayout from '../sider/Sider';

type WithLayoutProps = {
  children: ReactNode;
};

const WithLayout: FC<WithLayoutProps> = ({ children }) => {
  const { user } = useAuthContext();

  if (!user) {
    return <>{children}</>;
  }

  return <SiderLayout>{children}</SiderLayout>;
};

export default WithLayout;
