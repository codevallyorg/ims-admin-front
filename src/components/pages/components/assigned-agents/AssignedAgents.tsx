import Button from '@/components/ui/button/Button';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Empty } from 'antd';
import { FC } from 'react';

const AssignedAgents: FC = () => {
  return (
    <Empty
      image={
        <ExclamationCircleFilled

        //   style={{ height: 120, width: 120 }}
        />
      }
      //   imageStyle={{
      //     height: 120,
      //   }}
      description={<span>No Agents assigned to TDR User</span>}
    >
      <Button type="primary">Assign an Agent</Button>
    </Empty>
  );
};

export default AssignedAgents;
