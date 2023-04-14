import { Empty } from 'antd';
import { FC } from 'react';
import Button from '@/components/ui/button/Button';
import EmptyText from '@/components/ui/empty-text/EmptyText';
import Exclamation from '@/icons/Exclamation';

const AssignedAgents: FC = () => {
  return (
    <Empty
      image={<Exclamation />}
      description={<EmptyText>No Agents assigned to TDR User</EmptyText>}
    >
      <Button type="primary">Assign an Agent</Button>
    </Empty>
  );
};

export default AssignedAgents;
