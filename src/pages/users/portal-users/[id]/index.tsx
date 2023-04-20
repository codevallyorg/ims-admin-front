import { FC } from 'react';
import PortalUserForm from '@/components/pages/forms/portal-user/PortalUserForm';
import Loader from '@/components/ui/loader/Loader';
import { withLayout } from '@/components/layout/utils';
import Private from '@/components/layout/Private';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import { defaultStyle } from '@/utils/constants';

const ViewUserProfile: FC = () => {
  const { loadingPageHeader, selectedUser } = usePageHeaderContext();

  return (
    <div style={defaultStyle}>
      {loadingPageHeader ? (
        <Loader />
      ) : (
        <PortalUserForm readOnly defaultValues={selectedUser || undefined} />
      )}
    </div>
  );
};

export default withLayout(ViewUserProfile, Private);
