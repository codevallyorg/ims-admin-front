import { FilterValue, TablePaginationConfig } from 'antd/lib/table/interface';
import { useRouter } from 'next/router';
import { FC, Key, useCallback, useEffect, useState } from 'react';
import { Table } from 'antd';

import User from '@/services/user';
import { IUser, UserType } from '@/types/entities/IUser';
import {
  OrderByEnum,
  OrderEnum,
  PageMeta,
  PaginationOptions,
} from '@/types/payloads/pagination';

import {
  getArray,
  showErrorNotification,
  showNotification,
  showSentForApprovalNotification,
  typeCastQueryToString,
} from '@/utils/general';
import TableToolbar, {
  RoleOption,
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
import ReassignUsersRoleModal, {
  ReassignUsersRoleModalProps,
} from '../../modals/reassign-users-role/ReassignUsersRoleModal';
import Role from '@/services/role';
import { UserSwitchOutlined } from '@ant-design/icons';
import { PRIMARY_BLUE } from '@/utils/colors';

const RolesTable: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<IUser[]>([]);
  const [pageMeta, setPageMeta] = useState<PageMeta>();
  const [possibleTotalUsers, setPossibleTotalUsers] = useState<number>(0);
  const [selectedRows, setSelectedRows] = useState<IUser[]>([]);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>();

  const [openReassignUsersRoleModal, setOpenReassignUsersRoleModal] =
    useState<boolean>(false);

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

      const { data } = await User.getAllUsers(router.query);

      if (data.sentForApproval) {
        showSentForApprovalNotification();
        return;
      }

      setUsers(data.result.data);
      setPageMeta(data.result.meta);
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

  useEffect(() => {
    const loadRoleOptions = async () => {
      try {
        const roles = await Role.getAllRoles();

        const roleOptions: RoleOption[] = [];

        // TO DELETE
        roles.forEach((role: any) => {
          roleOptions.push({
            key: role.id,
            label: role.name,
            id: role.id,
            name: role.name,
            value: role.id,
          });
        });

        setRoleOptions(roleOptions);
      } catch (err: any) {
        console.error(err);
      }
    };

    loadRoleOptions();
  }, []);

  const rowSelection = {
    onChange: (_: Key[], selectedRows: IUser[]) => {
      setSelectedRows(selectedRows);
    },
  };

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

  const reassignRoleHandler = async (selectedRole: RoleOption) => {
    try {
      setLoading(true);

      const userIds = selectedRows.map((user) => user.id);

      const response = await User.reassignRole(userIds, selectedRole.id);

      if (response.count !== userIds.length) {
        throw new Error('Failed to assign role to all users');
      }

      loadAllUsers();

      const message = 'Role Re-assigned Successfully';
      const icon = <UserSwitchOutlined style={{ color: PRIMARY_BLUE }} />;

      selectedRows.forEach((user) => {
        showNotification({
          message,
          icon,
          description: `${user.firstName} ${user.lastName}'s role was successfully re-assigned to ${selectedRole.name}`,
        });
      });
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    } finally {
      setLoading(false);
      setOpenReassignUsersRoleModal(false);
    }
  };

  const toolbarProps: TableToolbarProps = {
    name: 'Manage user roles',
    secondaryButtonLabel: 'Re-assign',
    disabledSecondary: selectedRows.length ? false : true,
    roleOptions,
    onSelectRole: onSelectRoleItem,
    onClickSecondary: () => setOpenReassignUsersRoleModal(true),
    onSearch,
  };

  const reassignUsersRoleModalProps: ReassignUsersRoleModalProps = {
    loading,
    open: openReassignUsersRoleModal,
    selectedUsers: selectedRows,
    roleOptions,
    onCancel: () => setOpenReassignUsersRoleModal(false),
    onSubmit: reassignRoleHandler,
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

      <ReassignUsersRoleModal {...reassignUsersRoleModalProps} />

      <Table
        columns={getColumns(router)}
        loading={loading}
        // scroll={{ y: 360 }}
        dataSource={users}
        rowSelection={rowSelection}
        rowClassName={styles.row}
        onChange={columnActionsHandler}
        rowKey={(record) => record.id}
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
              router.push(`${subUrl}/${record.id}`);
            },
          };
        }}
      />
    </div>
  );
};

export default RolesTable;
