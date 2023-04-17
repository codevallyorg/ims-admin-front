import { Switch } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Dispatch, SetStateAction } from 'react';
import { IAction } from '@/types/entities/IAction';
import { RoleActions } from '@/types/payloads/role';

export const getColumns = (
  columnTitle: string,
  actionsPermitted: Record<number, RoleActions | undefined>,
  setActionsPermitted: Dispatch<
    SetStateAction<Record<number, RoleActions | undefined>>
  >,
): ColumnsType<IAction> => {
  const onPermissionChange = (checked: boolean, actionId: number) => {
    if (!checked) {
      actionsPermitted[actionId] = undefined;
      setActionsPermitted({ ...actionsPermitted });
      return;
    }

    if (actionsPermitted[actionId]) return;

    actionsPermitted[actionId] = { actionId, needsApproval: false };

    setActionsPermitted({ ...actionsPermitted });
  };

  const onApprovalChange = (checked: boolean, actionId: number) => {
    if (actionsPermitted[actionId] === undefined) return;

    actionsPermitted[actionId] = {
      actionId,
      needsApproval: checked,
    };

    setActionsPermitted({ ...actionsPermitted });
  };

  const columns = [
    {
      title: columnTitle,
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Permissions',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (actionId: number) => (
        <Switch onChange={(checked) => onPermissionChange(checked, actionId)} />
      ),
    },
    {
      title: 'Approval',
      dataIndex: 'approval',
      key: 'approval',
      width: 100,
      render: (_, record: IAction) => (
        <Switch
          onChange={(checked) => onApprovalChange(checked, record.id)}
          disabled={actionsPermitted[record.id] ? false : true}
        />
      ),
    },
  ];

  return columns;
};
