import { ColumnsType } from 'antd/lib/table';
import { NextRouter } from 'next/router';

import { UserType } from '@/types/entities/IUser';
import {
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
} from '@/utils/constants';
import { OrderByEnum, OrderEnum } from '@/types/payloads/pagination';
import { UserTableDataType } from './RolesTable';

export const getColumns = (
  router: NextRouter,
): ColumnsType<UserTableDataType> => {
  const { orderBy, order } = router.query;

  return [
    {
      title: 'First name',
      dataIndex: 'firstName',
      key: 'firstName',
      defaultSortOrder:
        orderBy === OrderByEnum.firstName
          ? order === OrderEnum.asc
            ? 'ascend'
            : 'descend'
          : undefined,
      sorter: () => 0,
    },
    {
      title: 'Last name',
      dataIndex: 'lastName',
      key: 'lastName',
      defaultSortOrder:
        orderBy === OrderByEnum.lastName
          ? order === OrderEnum.asc
            ? 'ascend'
            : 'descend'
          : undefined,
      sorter: () => 0,
    },
    {
      title: 'Email address',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Assigned role',
      dataIndex: 'role',
      key: 'role',
      defaultSortOrder:
        orderBy === OrderByEnum.role
          ? order === OrderEnum.asc
            ? 'ascend'
            : 'descend'
          : undefined,
      sorter: () => 0,
      render: (role) => role.name,
    },
  ];
};
