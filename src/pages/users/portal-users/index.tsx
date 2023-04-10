import { TablePaginationConfig } from 'antd/lib/table';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import Table from '@/components/ui/table/Table';
import {
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_INVITE_NEW_PORTAL_USER,
} from '@/utils/constants';
import styles from './PortalUsers.module.css';
import User from '@/services/user';
import { typeCastQuery } from '@/utils/general';
import {
  OrderByEnum,
  OrderEnum,
  PageMeta,
  PaginationOptions,
} from '@/types/payloads/pagination';
import { FilterValue } from 'antd/lib/table/interface';
import { columns } from './columns';
import { UserStatus } from '@/types/entities/IUser';

export interface PortalUserDataType {
  key: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  status: string;
  updatedAt: string;
}

const PortalUsers: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<PortalUserDataType[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMeta>();
  const [possibleTotalUsers, setPossibleTotalUsers] = useState<number>(0);

  const router = useRouter();

  // handle route query page defect
  useEffect(() => {
    const { page: curPage, orderBy } = router.query;

    const queryProps: PaginationOptions = {};

    if (curPage && orderBy) return;

    if (!curPage) {
      queryProps.page = 1;
    }

    if (!orderBy) {
      queryProps.orderBy = OrderByEnum.updatedAt;
      queryProps.order = OrderEnum.desc;
    }

    router.replace({ query: { ...router.query, ...queryProps } });
  }, [router]);

  useEffect(() => {
    const loadPortalUsers = async () => {
      try {
        setLoading(true);

        const { data: users, meta } = await User.getAllPortalUsers(
          router.query,
        );

        // TO DELETE
        for (const user of users) {
          user.key = user.id;
        }

        setUsers(users);
        setPageMeta(meta);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPortalUsers();
  }, [router.query]);

  useEffect(() => {
    let possibleTotalUsers = +typeCastQuery(router.query.page) * 10;

    if (pageMeta?.hasNextPage) {
      possibleTotalUsers += 10;
    }

    setPossibleTotalUsers(possibleTotalUsers);
  }, [pageMeta, router.query]);

  const onClickInvite = () => {
    router.push(ROUTE_INVITE_NEW_PORTAL_USER);
  };

  const onSelectRole = (props: any) => {
    const { filterByRole } = router.query;

    let roleKey = undefined;

    if (filterByRole !== props.key) {
      roleKey = props.key;
    }

    router.replace({ query: { ...router.query, filterByRole: roleKey } });
  };

  const applyPagination = (
    pagination: TablePaginationConfig,
    paginationOptions: PaginationOptions,
  ) => {
    const { page } = router.query;

    if (pagination.current !== page) {
      paginationOptions.page = pagination.current;
    }
  };

  const applySorts = (sorts: any, paginationOptions: PaginationOptions) => {
    const { orderBy, order } = router.query;

    if (!sorts.order) {
      paginationOptions.orderBy = undefined;
      paginationOptions.order = undefined;
      return;
    }

    const sortOrder = sorts.order === 'ascend' ? OrderEnum.asc : OrderEnum.desc;
    const sortField =
      sorts.field === OrderByEnum.firstName
        ? OrderByEnum.firstName
        : OrderByEnum.lastName;

    if (sortField !== orderBy || sortOrder !== order) {
      paginationOptions.orderBy = sortField;
      paginationOptions.order = sortOrder;
    }
  };

  const tableActionsHandler = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorts: any,
  ) => {
    const paginationOptions: PaginationOptions = {};

    applyPagination(pagination, paginationOptions);
    applySorts(sorts, paginationOptions);

    router.replace({
      query: {
        ...router.query,
        ...paginationOptions,
      },
    });
  };

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
      loading={loading}
      rowClassName={styles.row}
      onChange={tableActionsHandler}
      selectedRoleKey={typeCastQuery(router.query.filterByRole)}
      onSelectRole={onSelectRole}
      pagination={{
        responsive: true,
        hideOnSinglePage:
          pageMeta?.page === 1 && pageMeta.hasNextPage === false,
        current: +typeCastQuery(router.query.page) || 1,
        total: possibleTotalUsers,
      }}
      onRow={({ id }) => {
        return {
          onClick: () => {
            router.push(`${ROUTE_DASHBOARD_PORTAL_USERS}/${id}`);
          },
        };
      }}
    />
  );
};

export default withLayout(PortalUsers, Private);
