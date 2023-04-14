import { Empty } from 'antd';
import { FC } from 'react';
import Button from '@/components/ui/button/Button';
import EmptyText from '@/components/ui/empty-text/EmptyText';
import Exclamation from '@/icons/Exclamation';

const CardStock: FC = () => {
  return (
    <Empty
      image={<Exclamation />}
      description={
        <EmptyText>No Transport card stock has been issued</EmptyText>
      }
    >
      <Button type="primary">Add Stock</Button>
    </Empty>
  );
};

export default CardStock;
