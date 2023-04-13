import { FilterValue, TablePaginationConfig } from 'antd/lib/table/interface';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';
import { Table } from 'antd';

import User from '@/services/user';
import { UserStatus, UserType } from '@/types/entities/IUser';
import {
  OrderByEnum,
  OrderEnum,
  PageMeta,
  PaginationOptions,
} from '@/types/payloads/pagination';
import {
  INVITE_NEW_PORTAL_USER,
  INVITE_NEW_TDR_USER,
  PORTAL_USERS,
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
  ROUTE_INVITE_NEW_PORTAL_USER,
  ROUTE_INVITE_NEW_TDR_USER,
  TDR_USERS,
} from '@/utils/constants';
import { typeCastQueryToString } from '@/utils/general';
import TableToolbar, {
  TableToolbarProps,
} from '../../../ui/table-toolbar/TableToolbar';
import styles from './UsersTable.module.css';
import { getColumns } from './columns';

export interface PortalUserDataType {
  key: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  status: string;
  updatedAt: string;
}

export interface TDRUserDataType {
  key: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  status: string;
  updatedAt: string;
}

type UsersTableProps = {
  userType: UserType;
};

const UsersTable: FC<UsersTableProps> = ({ userType }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<PortalUserDataType[] | TDRUserDataType[]>(
    [],
  );
  const [pageMeta, setPageMeta] = useState<PageMeta>();
  const [possibleTotalUsers, setPossibleTotalUsers] = useState<number>(0);

  const router = useRouter();

  // handle route query page defect
  useEffect(() => {
    const { page, filterByType } = router.query;

    const queryProps: PaginationOptions = {};

    if (page && filterByType) return;

    if (!page) {
      queryProps.page = 1;
    }

    if (!filterByType) {
      queryProps.filterByType =
        userType === UserType.Portal ? UserType.Portal : UserType.TDR;
    }

    router.replace({ query: { ...router.query, ...queryProps } });
  }, [router, userType]);

  useEffect(() => {
    const loadAllUsers = async () => {
      try {
        setLoading(true);

        const { page, filterByType } = router.query;

        if (!page || !filterByType) {
          return;
        }

        const { data: users, meta } = await User.getAllUsers(router.query);

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

    loadAllUsers();
  }, [router]);

  useEffect(() => {
    let possibleTotalUsers = +typeCastQueryToString(router.query.page) * 10;

    if (pageMeta?.hasNextPage) {
      possibleTotalUsers += 10;
    }

    setPossibleTotalUsers(possibleTotalUsers);
  }, [pageMeta, router.query]);

  const onClickInvite = () => {
    const url =
      userType === UserType.Portal
        ? ROUTE_INVITE_NEW_PORTAL_USER
        : ROUTE_INVITE_NEW_TDR_USER;

    router.push(url);
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

  const applyFilters = (
    filters: Record<string, FilterValue | null>,
    paginationOptions: PaginationOptions,
  ) => {
    if (filters.status === null) {
      paginationOptions.filterByStatus = undefined;
      return;
    }

    const filterValues = filters.status.map((value) =>
      value === UserStatus.Invited ? UserStatus.Invited : UserStatus.LoggedIn,
    );

    paginationOptions.filterByStatus = filterValues;
  };

  const columnActionsHandler = (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorts: any,
  ) => {
    const paginationOptions: PaginationOptions = {};

    applyPagination(pagination, paginationOptions);
    applySorts(sorts, paginationOptions);
    applyFilters(filters, paginationOptions);

    router.replace({
      query: {
        ...router.query,
        ...paginationOptions,
      },
    });
  };

  const onSearch = (search: string) => {
    router.replace({ query: { ...router.query, search } });
  };

  const toolbarProps: TableToolbarProps = {
    name: userType === UserType.Portal ? PORTAL_USERS : TDR_USERS,
    viewButtonLabel: 'View Report',
    inviteButtonLabel:
      userType === UserType.Portal
        ? INVITE_NEW_PORTAL_USER
        : INVITE_NEW_TDR_USER,
    selectedRoleKey: typeCastQueryToString(router.query.filterByRole),
    defaultSearchText: typeCastQueryToString(router.query.search),
    onSelectRole,
    onClickInvite,
    onSearch,
  };

  return (
    <div>
      <TableToolbar {...toolbarProps} />

      <Table
        columns={getColumns(router)}
        dataSource={users}
        rowSelection={{
          type: 'checkbox',
          // onChange: selectRowHandler,
        }}
        loading={loading}
        rowClassName={styles.row}
        onChange={columnActionsHandler}
        pagination={{
          responsive: true,
          hideOnSinglePage:
            pageMeta?.page === 1 && pageMeta.hasNextPage === false,
          current: +typeCastQueryToString(router.query.page) || 1,
          total: possibleTotalUsers,
        }}
        onRow={({ key }) => {
          return {
            onClick: () => {
              const subUrl =
                userType === UserType.Portal
                  ? ROUTE_DASHBOARD_PORTAL_USERS
                  : ROUTE_DASHBOARD_TDR_USERS;

              router.push(`${subUrl}/${key}`);
            },
          };
        }}
      />
    </div>
  );
};

export default UsersTable;