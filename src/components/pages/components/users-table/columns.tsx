import { ColumnsType } from 'antd/lib/table';
import { Badge, Popconfirm } from 'antd';
import moment from 'moment';
import { NextRouter } from 'next/router';
import Link from 'next/link';
import { MouseEvent } from 'react';

import { IUser, UserStatus, UserType } from '@/types/entities/IUser';
import {
  NEUTRAL_5,
  PRIMARY_RED,
  SECONDARY_ORANGE,
  SECONDARY_RED,
} from '@/utils/colors';
import {
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
} from '@/utils/constants';
import { OrderByEnum, OrderEnum } from '@/types/payloads/pagination';
import { ExclamationCircleFilled } from '@ant-design/icons';

const popconfirmTitle = 'Are you sure you would like to unachive this profile?';

const popconfirmButtonsStyle = { borderRadius: 8 };

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
  isArchivedDashboard: boolean,
  popconfirmSubmitting: boolean,
  onUnarchive: (user: IUser) => void,
): ColumnsType<IUser> => {
  const { orderBy, order, filterByStatus, filterByType } = router.query;

  const dashboardUrl =
    filterByType === UserType.Portal
      ? ROUTE_DASHBOARD_PORTAL_USERS
      : ROUTE_DASHBOARD_TDR_USERS;

  const stopPropagation = (
    e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>,
  ) => {
    e.stopPropagation();
  };

  let statusFilteredValues;

  if (filterByStatus) {
    statusFilteredValues =
      typeof filterByStatus === 'string' ? [filterByStatus] : filterByStatus;
  }

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
      render: (_, user) =>
        !isArchivedDashboard ? (
          <Link
            href={`${dashboardUrl}/${user.id}/edit-user-profile`}
            onClick={stopPropagation}
          >
            Edit
          </Link>
        ) : (
          <a onClick={stopPropagation} style={{ display: 'block' }}>
            <Popconfirm
              title={popconfirmTitle}
              placement="topRight"
              okText="Yes"
              cancelText="No"
              okButtonProps={{
                loading: popconfirmSubmitting,
                style: popconfirmButtonsStyle,
              }}
              cancelButtonProps={{ style: popconfirmButtonsStyle }}
              onConfirm={onUnarchive.bind(this, user)}
              icon={<ExclamationCircleFilled style={{ color: PRIMARY_RED }} />}
            >
              <div>Unarchive</div>
            </Popconfirm>
          </a>
        ),
    },
  ];
};
