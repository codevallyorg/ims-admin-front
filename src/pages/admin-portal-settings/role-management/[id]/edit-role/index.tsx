import { FC } from 'react';
import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import RoleForm from '@/components/pages/forms/role/RoleForm';

const EditRole: FC = () => {
  return <RoleForm />;
};

export default withLayout(EditRole, Private);
