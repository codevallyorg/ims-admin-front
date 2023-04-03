import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';
import Search from 'antd/lib/input/Search';
import { FC } from 'react';
import Button from '../button/Button';
import styles from './TableToolbar.module.css';

export type TableToolbarProps = {
  name: string;
  viewButtonLabel?: string;
  inviteButtonLabel?: string;
  onClickView?: () => void;
  onClickInvite?: () => void;
  onSearch?: () => void;
};

const TableToolbar: FC<TableToolbarProps> = ({
  name,
  viewButtonLabel,
  inviteButtonLabel,
  onClickView,
  onClickInvite,
  onSearch,
}) => {
  return (
    <div className={styles.toolBar}>
      <div style={{ fontSize: 16, fontWeight: 500 }}>{name}</div>

      <div className={styles.rightSide}>
        <Dropdown
          menu={{ items: [] }}
          trigger={['click']}
          className={styles.dropdown}
        >
          <Space>
            By role
            <DownOutlined />
          </Space>
        </Dropdown>

        <Search
          placeholder="input search text"
          allowClear
          onSearch={onSearch}
          className={styles.searchBar}
        />

        {viewButtonLabel && (
          <Button onClick={onClickView}>{viewButtonLabel}</Button>
        )}

        {inviteButtonLabel && (
          <Button type="primary" onClick={onClickInvite}>
            <Space>
              <PlusOutlined />

              <span>{inviteButtonLabel}</span>
            </Space>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableToolbar;
