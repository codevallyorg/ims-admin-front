import TableAntd, { TableProps } from 'antd/lib/table';
import { FC } from 'react';
import TableToolbar, { TableToolbarProps } from './TableToolbar';

type T = any;

type CustomTableProps = TableToolbarProps & TableProps<T>;

const Table: FC<CustomTableProps> = ({
  name,
  viewButtonLabel,
  inviteButtonLabel,
  selectedRoleKey,
  defaultSearchText,
  onSelectRole,
  onClickView,
  onClickInvite,
  onSearch,
  ...tableProps
}) => {
  const toolbarProps = {
    name,
    viewButtonLabel,
    inviteButtonLabel,
    selectedRoleKey,
    defaultSearchText,
    onSelectRole,
    onClickView,
    onClickInvite,
    onSearch,
  };

  return (
    <div>
      <TableToolbar {...toolbarProps} />

      <TableAntd {...tableProps} />
    </div>
  );
};

export default Table;
