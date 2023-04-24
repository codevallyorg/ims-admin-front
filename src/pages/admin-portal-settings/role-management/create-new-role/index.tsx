import { FC } from 'react';
import RoleForm from '@/components/pages/forms/role/RoleForm';
import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';

const CreateNewRole: FC = () => {
  return <RoleForm />;
};

export default withLayout(CreateNewRole, Private);
