import Table from '@/components/ui/table/Table';
import { NEUTRAL_5, SECONDARY_ORANGE, SECONDARY_RED } from '@/utils/colors';
import { Badge, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { FC } from 'react';

import styles from './PortalUsers.module.css';

interface PortalUserDataType {
  key: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  status: string;
  updatedAt: string;
}

const columns: ColumnsType<PortalUserDataType> = [
  {
    title: 'First name',
    dataIndex: 'firstName',
    key: 'firstName',
    sorter: (a, b) =>
      a.firstName > b.firstName ? 1 : a.firstName < b.firstName ? -1 : 0,
  },
  {
    title: 'Last name',
    dataIndex: 'lastName',
    key: 'lastName',
    sorter: (a, b) =>
      a.lastName > b.lastName ? 1 : a.lastName < b.lastName ? -1 : 0,
  },
  {
    title: 'Email address',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: 'Assigned role',
    dataIndex: 'roleName',
    key: 'roleName',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status: string) => {
      const color =
        status === 'Invite sent'
          ? SECONDARY_RED
          : status === 'Logged in'
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
    render: () => (
      <Space size="middle">
        <a>Edit</a>
      </Space>
    ),
  },
];

const data: PortalUserDataType[] = [
  {
    key: 1,
    firstName: 'Sipho',
    lastName: 'Dhlanmi',
    email: 'sipho@imsglobal.co.za',
    roleName: 'SuperAdmin',
    status: 'Invite sent',
    updatedAt: new Date(2022, 1, 23).toISOString(),
  },
  {
    key: 2,
    firstName: 'Faizal',
    lastName: 'Mahomed',
    email: 'fmahomed@imsglobal.co.za',
    roleName: 'Admin',
    status: 'Logged in',
    updatedAt: new Date(2022, 4, 23).toISOString(),
  },
  {
    key: 3,
    firstName: 'Sue',
    lastName: 'Howkaye',
    email: 'showkay@fairpay.co.za',
    roleName: 'TDR',
    status: 'Logged out',
    updatedAt: new Date(2022, 7, 23).toISOString(),
  },
  {
    key: 4,
    firstName: 'Sipho',
    lastName: 'Dhlanmi',
    email: 'sipho@imsglobal.co.za',
    roleName: 'SuperAdmin',
    status: 'Invite sent',
    updatedAt: new Date(2022, 1, 23).toISOString(),
  },
  {
    key: 5,
    firstName: 'Faizal',
    lastName: 'Mahomed',
    email: 'fmahomed@imsglobal.co.za',
    roleName: 'Admin',
    status: 'Logged in',
    updatedAt: new Date(2022, 4, 23).toISOString(),
  },
  {
    key: 6,
    firstName: 'Sue',
    lastName: 'Howkaye',
    email: 'showkay@fairpay.co.za',
    roleName: 'TDR',
    status: 'Logged out',
    updatedAt: new Date(2022, 7, 23).toISOString(),
  },
];

const PortalUsers: FC = () => {
  return (
    <Table
      name="Portal User"
      viewButtonLabel="View Report"
      inviteButtonLabel="Invite new Portal User"
      columns={columns}
      dataSource={data}
      rowSelection={{
        type: 'checkbox',
        // onChange: selectRowHandler,
      }}
      rowClassName={styles.row}
    />
  );
};

export default PortalUsers;
