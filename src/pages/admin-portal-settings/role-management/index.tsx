import { FC } from 'react';
import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import RoleHeader from '@/components/pages/components/role-header/RoleHeader';
import RolesTable from '@/components/pages/components/roles-table/RolesTable';
import { defaultStyle } from '@/utils/constants';

const RoleManagement: FC = () => {
  return (
    <div style={{ overflowY: 'auto', maxHeight: '85vh' }}>
      <div style={{ ...defaultStyle, padding: '24px 24px 10px' }}>
        <RoleHeader />
      </div>

      <div style={defaultStyle}>
        <RolesTable />
      </div>
    </div>
  );
};

export default withLayout(RoleManagement, Private);
