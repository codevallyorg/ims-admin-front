import { FC } from 'react';

import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import UsersTable from '@/components/pages/components/users-table/UsersTable';
import { UserType } from '@/types/entities/IUser';

const ArchivedUsers: FC = () => {
  return <UsersTable userType={UserType.Archived} />;
};

export default withLayout(ArchivedUsers, Private);
