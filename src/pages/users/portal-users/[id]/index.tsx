import { FC } from 'react';
import PortalUserForm from '@/components/pages/forms/portal-user/PortalUserForm';
import Loader from '@/components/ui/loader/Loader';
import { withLayout } from '@/components/layout/utils';
import Private from '@/components/layout/Private';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';

const ViewUserProfile: FC = () => {
  const { loadingPageHeader, selectedUser } = usePageHeaderContext();

  if (loadingPageHeader) {
    return <Loader />;
  }

  return <PortalUserForm readOnly defaultValues={selectedUser || undefined} />;
};

export default withLayout(ViewUserProfile, Private);
