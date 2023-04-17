import { CategorisedActions } from '@/types/entities/IAction';
import { RoleActions } from '@/types/payloads/role';
import { Table, Tabs } from 'antd';
import { Dispatch, FC, SetStateAction, useState } from 'react';
import { getColumns } from './columns';

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
          style={{ marginBottom: 56 }}
        />,
      );
    }

    categoryTabItems.push({
      label: categoryKey,
      key: categoryKey,
      children: permissionsTables,
    });
  }

  return (
    <>
      <div>Permissions</div>

      <Tabs type="card" items={categoryTabItems} />
    </>
  );
};

export default Permissions;
