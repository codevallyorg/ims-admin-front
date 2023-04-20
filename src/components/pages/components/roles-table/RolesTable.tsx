import { FilterValue, TablePaginationConfig } from 'antd/lib/table/interface';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';

import User from '@/services/user';
import { UserType } from '@/types/entities/IUser';
import {
  OrderByEnum,
  OrderEnum,
  PageMeta,
  PaginationOptions,
} from '@/types/payloads/pagination';

import { getArray, typeCastQueryToString } from '@/utils/general';
import TableToolbar, {
  TableToolbarProps,
} from '../../../ui/table-toolbar/TableToolbar';
import styles from './RolesTable.module.css';
import { getColumns } from './columns';
import Exclamation from '@/icons/Exclamation';
import EmptyText from '@/components/ui/empty-text/EmptyText';
import {
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
} from '@/utils/constants';

export interface UserTableDataType {
  key: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
  status: string;
  updatedAt: string;
  type: UserType;
}

const RolesTable: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<UserTableDataType[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMeta>();
  const [possibleTotalUsers, setPossibleTotalUsers] = useState<number>(0);

  const router = useRouter();

  // handle route query page defect
  useEffect(() => {
    const { page } = router.query;

    if (page) return;

    router.replace({ query: { ...router.query, page: 1 } });
  }, [router]);

  const loadAllUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { page } = router.query;

      if (!page) return;

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
  }, [router]);

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

  const onClickView = () => {};

  const onSelectRoleItem = useCallback(
    (props: any) => {
      const { filterByRole } = router.query;
      const { key } = props;

      let filteredRoles = getArray(filterByRole);

      const selectRoleIndex = filteredRoles.indexOf(key);

      if (selectRoleIndex !== -1) {
        filteredRoles.splice(selectRoleIndex, 1);
      } else {
        filteredRoles.push(key);
      }

      router.replace({
        query: { ...router.query, filterByRole: filteredRoles },
      });
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
        : sorts.field === OrderByEnum.lastName
        ? OrderByEnum.lastName
        : OrderByEnum.role;

    if (sortField !== orderBy || sortOrder !== order) {
      paginationOptions.orderBy = sortField;
      paginationOptions.order = sortOrder;
    }
  };

  const columnActionsHandler = (
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

  const onSearch = (search: string) => {
    router.replace({ query: { ...router.query, search } });
  };

  const toolbarProps: TableToolbarProps = {
    name: 'Manage user roles',
    viewButtonLabel: 'Re-assign',
    onSelectRole: onSelectRoleItem,
    onClickView,
    onSearch,
  };

  // if (!loading && users.length === 0) {
  //   return (
  //     <Empty image={<Exclamation />} description={false}>
  //       <EmptyText>No user have been registered yet.</EmptyText>
  //     </Empty>
  //   );
  // }

  return (
    <div>
      <TableToolbar {...toolbarProps} />

      <Table
        columns={getColumns(router)}
        // scroll={{ y: 360 }}
        dataSource={users}
        rowSelection={{}}
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
        onRow={(record) => {
          return {
            onClick: () => {
              const subUrl =
                record.type === UserType.Portal
                  ? ROUTE_DASHBOARD_PORTAL_USERS
                  : ROUTE_DASHBOARD_TDR_USERS;
              router.push(`${subUrl}/${record.key}`);
            },
          };
        }}
      />
    </div>
  );
};

export default RolesTable;
