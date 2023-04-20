import { FilterValue, TablePaginationConfig } from 'antd/lib/table/interface';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';
import { Empty, Table } from 'antd';

import User from '@/services/user';
import { UserStatus, UserType } from '@/types/entities/IUser';
import {
  OrderByEnum,
  OrderEnum,
  PageMeta,
  PaginationOptions,
} from '@/types/payloads/pagination';
import {
  ARCHIVED_USERS,
  INVITE_NEW_PORTAL_USER,
  INVITE_NEW_TDR_USER,
  PORTAL_USERS,
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
  ROUTE_INVITE_NEW_PORTAL_USER,
  ROUTE_INVITE_NEW_TDR_USER,
  TDR_USERS,
} from '@/utils/constants';
import {
  showErrorNotification,
  showNotification,
  typeCastQueryToString,
} from '@/utils/general';
import TableToolbar, {
  TableToolbarProps,
} from '../../../ui/table-toolbar/TableToolbar';
import styles from './UsersTable.module.css';
import { getColumns } from './columns';
import { SyncOutlined } from '@ant-design/icons';
import { PRIMARY_BLUE } from '@/utils/colors';
import Exclamation from '@/icons/Exclamation';
import EmptyText from '@/components/ui/empty-text/EmptyText';

export interface UserTableDataType {
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
  const [users, setUsers] = useState<UserTableDataType[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMeta>();
  const [possibleTotalUsers, setPossibleTotalUsers] = useState<number>(0);
  const [popconfirmSubmitting, setPopconfirmSubmitting] =
    useState<boolean>(false);

  const router = useRouter();

  const isArchivedDashboard = userType === UserType.Archived;

  // handle route query page defect
  useEffect(() => {
    const { page, filterByType } = router.query;

    const queryProps: PaginationOptions = {};

    if (page && (filterByType || isArchivedDashboard)) return;

    if (!page) {
      queryProps.page = 1;
    }

    if (!filterByType && !isArchivedDashboard) {
      queryProps.filterByType =
        userType === UserType.Portal ? UserType.Portal : UserType.TDR;
    }

    router.replace({ query: { ...router.query, ...queryProps } });
  }, [router, isArchivedDashboard, userType]);

  const loadAllUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { page, filterByType } = router.query;

      if (!page || (!isArchivedDashboard && !filterByType)) {
        return;
      }

      const { data: users, meta } = await User.getAllUsers(
        router.query,
        isArchivedDashboard,
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
  }, [router, isArchivedDashboard]);

  useEffect(() => {
    loadAllUsers();
  }, [loadAllUsers]);

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

  const onSelectRoleItem = useCallback(
    (props: any) => {
      const { filterByRole } = router.query;

      let roleKey = undefined;

      if (filterByRole !== props.key) {
        roleKey = props.key;
      }

      router.replace({ query: { ...router.query, filterByRole: roleKey } });
    },
    [router],
  );

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

  const onUnarchive = async (user: UserTableDataType) => {
    try {
      setPopconfirmSubmitting(true);

      const response = await User.toggleArchiveUserProfile(user.key);

      if (!response.success) {
        throw new Error('Something went wrong');
      }

      loadAllUsers();

      const message = `User Unarchived Successfully`;
      const description = `${user.firstName} ${user.lastName}'s profile has been unarchived!`;
      const icon = <SyncOutlined style={{ color: PRIMARY_BLUE }} />;

      showNotification({
        message,
        description,
        icon,
      });
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    } finally {
      setPopconfirmSubmitting(false);
    }
  };

  let name, inviteButtonLabel;
  let [viewButtonLabel, onSelectRole]: [
    undefined | string,
    undefined | ((props: any) => void),
  ] = ['View Report', onSelectRoleItem];

  switch (userType) {
    case UserType.Portal:
      name = PORTAL_USERS;
      inviteButtonLabel = INVITE_NEW_PORTAL_USER;
      break;

    case UserType.TDR:
      name = TDR_USERS;
      inviteButtonLabel = INVITE_NEW_TDR_USER;
      break;

    case UserType.Archived:
      name = ARCHIVED_USERS;
      viewButtonLabel = undefined;
      inviteButtonLabel = undefined;
      onSelectRole = undefined;
      break;
  }

  const toolbarProps: TableToolbarProps = {
    name,
    viewButtonLabel,
    inviteButtonLabel,
    selectedRoleKey: typeCastQueryToString(router.query.filterByRole),
    defaultSearchText: typeCastQueryToString(router.query.search),
    onSelectRole,
    onClickInvite,
    onSearch,
  };

  if (!loading && users.length === 0) {
    return (
      <Empty image={<Exclamation />} description={false}>
        <EmptyText>
          No user have been {isArchivedDashboard ? 'archived' : 'registered'}{' '}
          yet.
        </EmptyText>
      </Empty>
    );
  }

  return (
    <div>
      <TableToolbar {...toolbarProps} />

      <Table
        columns={getColumns(
          router,
          isArchivedDashboard,
          popconfirmSubmitting,
          onUnarchive,
        )}
        dataSource={users}
        rowSelection={isArchivedDashboard ? undefined : {}}
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
