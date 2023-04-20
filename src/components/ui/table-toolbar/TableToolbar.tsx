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

export type RoleOption = ItemType & {
  id: number;
  name: string;
  value: number;
};

export type TableToolbarProps = {
  name: string;
  secondaryButtonLabel?: string;
  primaryButtonLabel?: string;
  disabledSecondary?: boolean;
  roleOptions?: RoleOption[];
  onSelectRole?: MenuClickEventHandler;
  onClickSecondary?: () => void;
  onClickPrimary?: () => void;
  onSearch?: (value: string) => void;
};

const TableToolbar: FC<TableToolbarProps> = ({
  name,
  secondaryButtonLabel,
  primaryButtonLabel,
  disabledSecondary,
  roleOptions,
  onSelectRole,
  onClickSecondary,
  onClickPrimary,
  onSearch,
}) => {
  const [selectedRoleTags, setSelectedRoleTags] = useState<ReactElement[]>([]);

  const router = useRouter();
  const { filterByRole, search } = router.query;

  const defaultSearchText = typeCastQueryToString(search);
  const selectedRoleKeys = useMemo(
    () => getArray(filterByRole),
    [filterByRole],
  );

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
    if (!roleOptions) return;

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

        {secondaryButtonLabel && (
          <Button onClick={onClickSecondary} disabled={disabledSecondary}>
            {secondaryButtonLabel}
          </Button>
        )}

        {primaryButtonLabel && (
          <Button type="primary" onClick={onClickPrimary}>
            <Space>
              <PlusOutlined />

              <span>{primaryButtonLabel}</span>
            </Space>
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableToolbar;
