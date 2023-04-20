import { FC } from 'react';

import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import UsersTable from '@/components/pages/components/users-table/UsersTable';
import { UserType } from '@/types/entities/IUser';
import { defaultStyle } from '@/utils/constants';

const TDRUsers: FC = () => {
  return (
    <div style={defaultStyle}>
      <UsersTable userType={UserType.TDR} />
    </div>
  );
};

export default withLayout(TDRUsers, Private);
