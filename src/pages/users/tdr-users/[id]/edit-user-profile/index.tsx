import { FC } from 'react';

import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import EditUserProfile from '@/components/pages/components/edit-user-profile/EditUserProfile';
import { UserType } from '@/types/entities/IUser';
import { defaultStyle } from '@/utils/constants';

const EditTDRUserProfile: FC = () => {
  return (
    <div style={defaultStyle}>
      <EditUserProfile userType={UserType.TDR} />;
    </div>
  );
};

export default withLayout(EditTDRUserProfile, Private);
