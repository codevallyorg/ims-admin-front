import { Table, Tabs } from 'antd';
import { Dispatch, FC, SetStateAction } from 'react';
import { CategorisedActions } from '@/types/entities/IAction';
import { getColumns } from './columns';
import { defaultStyle } from '@/utils/constants';
import styles from './Permissions.module.css';
import { RoleActionsPayload } from '@/types/payloads/role';

type PermissionsProps = {
  readOnly?: boolean;
  categorisedActions: CategorisedActions;
  actionsPermitted: Record<number, RoleActionsPayload | undefined>;
  setActionsPermitted: Dispatch<
    SetStateAction<Record<number, RoleActionsPayload | undefined>>
  >;
};

const Permissions: FC<PermissionsProps> = ({
  readOnly,
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
            readOnly,
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
