import { ColumnsType } from 'antd/lib/table';
import { Badge } from 'antd';
import moment from 'moment';
import Link from 'next/link';

import { UserStatus } from '@/types/entities/IUser';
import { NEUTRAL_5, SECONDARY_ORANGE, SECONDARY_RED } from '@/utils/colors';
import { PortalUserDataType } from '.';
import { ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';

export const columns: ColumnsType<PortalUserDataType> = [
  {
    title: 'First name',
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: () => 0,
  },
  {
    title: 'Last name',
    dataIndex: 'lastName',
    key: 'lastName',
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
    render: (time: string) => moment(time).format('HH:mm:ss DD MMM, YYYY'),
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
