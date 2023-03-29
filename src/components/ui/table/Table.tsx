import TableAntd, { TableProps } from 'antd/lib/table';
import { FC } from 'react';
import TableToolbar, { TableToolbarProps } from './TableToolbar';

type T = any;

type CustomTableProps = TableToolbarProps & TableProps<T>;

const Table: FC<CustomTableProps> = ({
  name,
  viewButtonLabel,
  inviteButtonLabel,
  onClickView,
  onClickInvite,
  ...tableProps
}) => {
  const toolbarProps = {
    name,
    viewButtonLabel,
    inviteButtonLabel,
    onClickView,
    onClickInvite,
  };

  return (
    <div>
      <TableToolbar {...toolbarProps} />

      <TableAntd {...tableProps} pagination={{ hideOnSinglePage: true }} />
    </div>
  );
};

export default Table;
