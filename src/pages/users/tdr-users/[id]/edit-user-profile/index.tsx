import { FC } from 'react';

import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import EditUserProfile from '@/components/pages/components/edit-user-profile/EditUserProfile';
import { UserType } from '@/types/entities/IUser';

const EditTDRUserProfile: FC = () => {
  return <EditUserProfile userType={UserType.TDR} />;
};

export default withLayout(EditTDRUserProfile, Private);
