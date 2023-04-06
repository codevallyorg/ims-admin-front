import { Dropdown, Space } from 'antd';
import Search from 'antd/lib/input/Search';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import { FC, useEffect, useState } from 'react';

import { SECONDARY_BLUE } from '@/utils/colors';
import Role from '@/services/role';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import Button from '../button/Button';
import styles from './TableToolbar.module.css';

export type TableToolbarProps = {
  name: string;
  viewButtonLabel?: string;
  inviteButtonLabel?: string;
  selectedRoleKey?: string;
  onSelectRole?: MenuClickEventHandler;
  onClickView?: () => void;
  onClickInvite?: () => void;
  onSearch?: () => void;
};

const TableToolbar: FC<TableToolbarProps> = ({
  name,
  viewButtonLabel,
  inviteButtonLabel,
  selectedRoleKey,
  onSelectRole,
  onClickView,
  onClickInvite,
  onSearch,
}) => {
  const [roleOptions, setRoleOptions] = useState<ItemType[]>([]);

  useEffect(() => {
    const loadRoleOptions = async () => {
      try {
        const roles = await Role.getRoleSelectOptions();

        // TO DELETE
        roles.forEach((role: any) => (role.key = role.value));

        setRoleOptions(roles);
      } catch (err: any) {
        console.error(err);
      }
    };

    loadRoleOptions();
  }, []);

  return (
    <div className={styles.toolBar}>
      <div style={{ fontSize: 16, fontWeight: 500 }}>{name}</div>

      <div className={styles.rightSide}>
        <Dropdown
          menu={{
            items: roleOptions,
            onClick: onSelectRole,
            selectedKeys: [selectedRoleKey || ''],
          }}
          trigger={['click']}
          className={styles.dropdown}
        >
          <Space
            style={selectedRoleKey ? { color: SECONDARY_BLUE } : undefined}
          >
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
