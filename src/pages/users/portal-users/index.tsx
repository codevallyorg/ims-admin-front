import { Badge } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import moment from 'moment';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import Table from '@/components/ui/table/Table';
import { NEUTRAL_5, SECONDARY_ORANGE, SECONDARY_RED } from '@/utils/colors';
import {
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_INVITE_NEW_PORTAL_USER,
} from '@/utils/constants';
import styles from './PortalUsers.module.css';
import User from '@/services/user';
import { UserStatus } from '@/types/entities/IUser';
import Link from 'next/link';

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
    dataIndex: 'role',
    key: 'role',
    render: (role) => role.name,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
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

const PortalUsers: FC = () => {
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<PortalUserDataType[]>([]);

  const router = useRouter();

  // handle route query page defect
  useEffect(() => {
    const { page: curPage } = router.query;

    if (!curPage) {
      router.replace({ query: { ...router.query, page: 1 } });
    } else {
      setPage(+curPage);
    }
  }, [router]);

  const onClickInvite = () => {
    router.push(ROUTE_INVITE_NEW_PORTAL_USER);
  };

  useEffect(() => {
    const loadPortalUsers = async () => {
      try {
        setLoading(true);

        const { data: users } = await User.getAllPortalUsers();

        // TO DELETE
        for (const user of users) {
          user.key = user.id;
        }

        setUsers(users);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPortalUsers();
  }, []);

  return (
    <Table
      name="Portal Users"
      viewButtonLabel="View Report"
      inviteButtonLabel="Invite new Portal User"
      onClickInvite={onClickInvite}
      columns={columns}
      dataSource={users}
      rowSelection={{
        type: 'checkbox',
        // onChange: selectRowHandler,
      }}
      onRow={({ id }) => {
        return {
          onClick: () => {
            router.push(`${ROUTE_DASHBOARD_PORTAL_USERS}/${id}`);
          },
        };
      }}
      loading={loading}
      rowClassName={styles.row}
      pagination={{ hideOnSinglePage: true, current: page }}
    />
  );
};

export default withLayout(PortalUsers, Private);
