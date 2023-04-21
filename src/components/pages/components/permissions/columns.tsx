import { Switch } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { Dispatch, SetStateAction } from 'react';
import { IAction } from '@/types/entities/IAction';
import { RoleActionsPayload } from '@/types/payloads/role';

export const getColumns = (
  columnTitle: string,
  actionsPermitted: Record<number, RoleActionsPayload | undefined>,
  setActionsPermitted: Dispatch<
    SetStateAction<Record<number, RoleActionsPayload | undefined>>
  >,
  readOnly?: boolean,
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
      render: (actionId: number) => {
        return (
          <Switch
            checked={!!actionsPermitted[actionId]}
            onChange={(checked) => onPermissionChange(checked, actionId)}
            disabled={readOnly}
          />
        );
      },
    },
    {
      title: 'Approval',
      dataIndex: 'approval',
      key: 'approval',
      width: 100,
      render: (_, record: IAction) => (
        <Switch
          checked={actionsPermitted[record.id]?.needsApproval}
          onChange={(checked) => onApprovalChange(checked, record.id)}
          disabled={
            readOnly !== undefined ? readOnly : !!!actionsPermitted[record.id]
          }
        />
      ),
    },
  ];

  return columns;
};
