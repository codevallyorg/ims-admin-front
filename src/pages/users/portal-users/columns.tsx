import { ColumnsType } from 'antd/lib/table';
import { Badge } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import { NextRouter } from 'next/router';

import { UserStatus } from '@/types/entities/IUser';
import { NEUTRAL_5, SECONDARY_ORANGE, SECONDARY_RED } from '@/utils/colors';
import { PortalUserDataType } from '.';
import { ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';
import { OrderByEnum, OrderEnum } from '@/types/payloads/pagination';

const getTimestampValue = (time: string) => {
  const timestamp = moment(time);
  const intervalInHrs = moment().diff(time, 'hour');

  if (intervalInHrs > 24) {
    return timestamp.format('DD MMM, YYYY');
  }

  if (intervalInHrs > 0) {
    return `${intervalInHrs} ${intervalInHrs === 1 ? 'hour' : 'hours'} ago`;
  }

  const intervalInMins = moment().diff(time, 'minute');
  if (intervalInMins === 0) {
    return `Now`;
  }

  return `${intervalInMins} min ago`;
};

export const getColumns = (
  router: NextRouter,
): ColumnsType<PortalUserDataType> => {
  const { orderBy, order, filterByStatus } = router.query;

  const statusFilteredValues =
    typeof filterByStatus === 'string' ? [filterByStatus] : filterByStatus;

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
      render: (role) => role.name,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      defaultFilteredValue: statusFilteredValues,
      filters: [
        { text: UserStatus.Invited, value: UserStatus.Invited },
        {
          text: UserStatus.LoggedIn,
          value: UserStatus.LoggedIn,
        },
      ],
      onFilter: () => true,
      render: (status: string) => {
        const color =
          status === UserStatus.Invited
            ? SECONDARY_RED
            : status === UserStatus.LoggedIn
            ? SECONDARY_ORANGE
            : NEUTRAL_5;

        return <Badge color={color} text={status} />;
      },
    },
    {
      title: 'Timestamp',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      render: (time: string) => getTimestampValue(time),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, { key }) => (
        <Link
          href={`${ROUTE_DASHBOARD_PORTAL_USERS}/${key}/edit-user-profile`}
          onClick={(e) => e.stopPropagation()}
        >
          Edit
        </Link>
      ),
    },
  ];
};
