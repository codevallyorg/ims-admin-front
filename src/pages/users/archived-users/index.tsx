import { FC } from 'react';

import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import UsersTable from '@/components/pages/components/users-table/UsersTable';
import { UserType } from '@/types/entities/IUser';
import { defaultStyle } from '@/utils/constants';

const ArchivedUsers: FC = () => {
  return (
    <div style={defaultStyle}>
      <UsersTable userType={UserType.Archived} />
    </div>
  );
};

export default withLayout(ArchivedUsers, Private);
