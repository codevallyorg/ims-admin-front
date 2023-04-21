import RoleForm from '@/components/pages/forms/role/RoleForm';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import { FC } from 'react';

const ViewRole: FC = () => {
  const { selectedRole } = usePageHeaderContext();

  return <RoleForm readOnly defaultValues={selectedRole || undefined} />;
};

export default ViewRole;
