import { Table, Tabs } from 'antd';
import { Dispatch, FC, SetStateAction } from 'react';
import { CategorisedActions } from '@/types/entities/IAction';
import { RoleActions } from '@/types/payloads/role';
import { getColumns } from './columns';
import { defaultStyle } from '@/utils/constants';
import styles from './Permissions.module.css';

type PermissionsProps = {
  categorisedActions: CategorisedActions;
  actionsPermitted: Record<number, RoleActions | undefined>;
  setActionsPermitted: Dispatch<
    SetStateAction<Record<number, RoleActions | undefined>>
  >;
};

const Permissions: FC<PermissionsProps> = ({
  categorisedActions,
  actionsPermitted,
  setActionsPermitted,
}) => {
  const categoryTabItems = [];

  for (const categoryKey in categorisedActions) {
    const permissionsTables = [];

    for (const subjectKey in categorisedActions[categoryKey]) {
      permissionsTables.push(
        <Table
          key={`${categoryKey} ${subjectKey}`}
          columns={getColumns(
            subjectKey,
            actionsPermitted,
            setActionsPermitted,
          )}
          dataSource={categorisedActions[categoryKey][subjectKey]}
          rowKey={(record) => record.id}
          pagination={false}
        />,
      );
    }

    categoryTabItems.push({
      label: categoryKey,
      key: categoryKey,
      children: (
        <div className={styles.tablesContainer}>{permissionsTables}</div>
      ),
    });
  }

  return (
    <div style={{ ...defaultStyle, padding: 0 }}>
      <div className={styles.permissions}>Permissions</div>

      <Tabs
        type="card"
        items={categoryTabItems}
        tabBarStyle={{ marginBottom: 24, marginTop: 10 }}
        tabBarExtraContent={{ left: <div>&nbsp;&ensp;&emsp;</div> }}
      />
    </div>
  );
};

export default Permissions;
