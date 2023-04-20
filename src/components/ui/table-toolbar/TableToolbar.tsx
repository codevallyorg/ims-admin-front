import { Dropdown, Space, Tag } from 'antd';
import Search from 'antd/lib/input/Search';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import { MenuClickEventHandler } from 'rc-menu/lib/interface';
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { SECONDARY_BLUE } from '@/utils/colors';
import Role from '@/services/role';
import { DownOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './TableToolbar.module.css';
import Button from '@/components/ui/button/Button';
import { useRouter } from 'next/router';
import { getArray, typeCastQueryToString } from '@/utils/general';

type roleData = {
  id: number;
  name: string;
};

export type TableToolbarProps = {
  name: string;
  viewButtonLabel?: string;
  inviteButtonLabel?: string;
  onSelectRole?: MenuClickEventHandler;
  onClickView?: () => void;
  onClickInvite?: () => void;
  onSearch?: (value: string) => void;
};

const TableToolbar: FC<TableToolbarProps> = ({
  name,
  viewButtonLabel,
  inviteButtonLabel,
  onSelectRole,
  onClickView,
  onClickInvite,
  onSearch,
}) => {
  const [roleOptions, setRoleOptions] = useState<(ItemType & roleData)[]>([]);
  const [selectedRoleTags, setSelectedRoleTags] = useState<ReactElement[]>([]);

  const router = useRouter();
  const { filterByRole, search } = router.query;

  const defaultSearchText = typeCastQueryToString(search);
  const selectedRoleKeys = useMemo(
    () => getArray(filterByRole),
    [filterByRole],
  );

  useEffect(() => {
    const loadRoleOptions = async () => {
      try {
        const roles = await Role.getAllRoles();

        const roleOptions: (ItemType & roleData)[] = [];

        // TO DELETE
        roles.forEach((role: any) => {
          roleOptions.push({
            key: role.id,
            label: role.name,
            id: role.id,
            name: role.name,
          });
        });

        setRoleOptions(roleOptions);
      } catch (err: any) {
        console.error(err);
      }
    };

    onSelectRole && loadRoleOptions();
  }, [onSelectRole]);

  const closeTagHandler = useCallback(
    (id: number) => {
      const newSelectedRoles = selectedRoleKeys?.filter(
        (key: string) => key !== `${id}`,
      );

      router.replace({
        query: { ...router.query, filterByRole: newSelectedRoles },
      });
    },
    [selectedRoleKeys, router],
  );

  useEffect(() => {
    const tags: ReactElement[] = [];

    for (const roleOption of roleOptions) {
      if (!selectedRoleKeys?.includes(`${roleOption.id}`)) continue;

      if (tags.length >= 3) break;

      tags.push(
        <Tag
          closable
          key={roleOption.id}
          onClose={() => closeTagHandler(roleOption.id)}
          color="processing"
        >
          {roleOption.name}
        </Tag>,
      );
    }

    const [totalTags, totalSelectedRoles] = [
      tags.length,
      selectedRoleKeys.length,
    ];

    if (totalTags !== totalSelectedRoles) {
      tags.push(
        <Tag key={'extra'} color="processing">
          +{totalSelectedRoles - totalTags}
        </Tag>,
      );
    }

    setSelectedRoleTags(tags);
  }, [closeTagHandler, roleOptions, selectedRoleKeys]);

  return (
    <div className={styles.toolBar}>
      <div style={{ fontSize: 16, fontWeight: 500 }}>{name}</div>

      <div className={styles.rightSide}>
        {onSelectRole && (
          <>
            <div>{selectedRoleTags}</div>

            <Dropdown
              menu={{
                items: roleOptions,
                onClick: onSelectRole,
                selectedKeys: selectedRoleKeys,
                multiple: true,
              }}
              trigger={['click']}
              className={styles.dropdown}
            >
              <Space
                style={
                  selectedRoleKeys?.length
                    ? { color: SECONDARY_BLUE }
                    : undefined
                }
              >
                Filter by Role
                <DownOutlined />
              </Space>
            </Dropdown>
          </>
        )}

        <Search
          placeholder="input search text"
          defaultValue={defaultSearchText}
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
