import Button from '@/components/ui/button/Button';
import { ExclamationCircleFilled } from '@ant-design/icons';
import { Empty } from 'antd';
import { FC } from 'react';

const CardStock: FC = () => {
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
      description={<span>No Transport card stock has been issued</span>}
    >
      <Button type="primary">Add Stock</Button>
    </Empty>
  );
};

export default CardStock;
