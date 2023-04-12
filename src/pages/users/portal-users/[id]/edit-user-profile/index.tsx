import { FC } from 'react';

import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import EditUserProfile from '@/components/pages/components/edit-user-profile/EditUserProfile';
import { UserType } from '@/types/entities/IUser';

const EditPortalUserProfile: FC = () => {
  return <EditUserProfile userType={UserType.Portal} />;
};

export default withLayout(EditPortalUserProfile, Private);
