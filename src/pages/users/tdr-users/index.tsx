import { FC } from 'react';

import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import UsersTable from '@/components/pages/components/users-table/UsersTable';
import { UserType } from '@/types/entities/IUser';

const TDRUsers: FC = () => {
  return <UsersTable userType={UserType.TDR} />;
};

export default withLayout(TDRUsers, Private);
