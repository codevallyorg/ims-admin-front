import { FilterValue, TablePaginationConfig } from 'antd/lib/table/interface';
import { useRouter } from 'next/router';
import { FC, useCallback, useEffect, useState } from 'react';
import { Alert, Empty, Table } from 'antd';

import User from '@/services/user';
import { IUser, UserStatus, UserType } from '@/types/entities/IUser';
import {
  ActionCategory,
  ActionName,
  ActionSubject,
} from '@/types/entities/IAction';
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
import styles from './UsersTable.module.css';
import { getColumns } from './columns';
import { SyncOutlined } from '@ant-design/icons';
import { PRIMARY_BLUE } from '@/utils/colors';
import Exclamation from '@/icons/Exclamation';
import EmptyText from '@/components/ui/empty-text/EmptyText';
import Role from '@/services/role';
import { useAuthContext } from '@/contexts/AuthProvider';
import { classNames } from '@/utils/general';

type UsersTableProps = {
  userType?: UserType;
  isViewRole?: boolean;
};

const UsersTable: FC<UsersTableProps> = ({ userType, isViewRole }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<IUser[]>([]);
  const [isViewUsersPermitted, setIsViewUsersPermitted] =
    useState<boolean>(true);
  const [pageMeta, setPageMeta] = useState<PageMeta>();
  const [possibleTotalUsers, setPossibleTotalUsers] = useState<number>(0);
  const [popconfirmSubmitting, setPopconfirmSubmitting] =
    useState<boolean>(false);
  const [roleOptions, setRoleOptions] = useState<RoleOption[]>();

  const router = useRouter();
  const { roleActionsMap } = useAuthContext();

  const isArchivedDashboard = userType === UserType.Archived;

  // handle route query page defect
  useEffect(() => {
    const { page, filterByType } = router.query;

    const queryProps: PaginationOptions = {};

    if (page && (!userType || filterByType || isArchivedDashboard)) return;

    if (!page) {
      queryProps.page = 1;
    }

    if (userType && !filterByType && !isArchivedDashboard) {
      queryProps.filterByType =
        userType === UserType.Portal ? UserType.Portal : UserType.TDR;
    }

    router.replace({ query: { ...router.query, ...queryProps } });
  }, [router, isArchivedDashboard, userType]);

  const loadAllUsers = useCallback(async () => {
    try {
      setLoading(true);

      const { page, filterByType } = router.query;

      if (!page || (userType && !isArchivedDashboard && !filterByType)) {
        return;
      }

      if (!isArchivedDashboard) {
        const actionCategory =
          userType === UserType.Portal
            ? ActionCategory.PortalUsers
            : ActionCategory.TDRUsers;

        const actionKey = `${actionCategory}${ActionSubject.Profile}${ActionName.ReadAll}`;

        if (!roleActionsMap[actionKey]) {
          setIsViewUsersPermitted(false);
          return;
        }
      }

      const { data } = await User.getAllUsers(
        router.query,
        isArchivedDashboard,
      );

      setUsers(data.result.data);
      setPageMeta(data.result.meta);
      setIsViewUsersPermitted(true);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router, userType, isArchivedDashboard, roleActionsMap]);

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
    loadAllUsers();
  }, [loadAllUsers]);

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

  const onUnarchive = async (user: IUser) => {
    try {
      setPopconfirmSubmitting(true);

      const { data } = await User.toggleArchiveUserProfile(user.id);

      if (!data.success) {
        throw new Error('Something went wrong');
      }

      if (data.sentForApproval) {
        showSentForApprovalNotification();
        return;
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

  let name, primaryButtonLabel;
  let [secondaryButtonLabel, onSelectRole]: [
    undefined | string,
    undefined | ((props: any) => void),
  ] = ['View Report', onSelectRoleItem];

  switch (userType) {
    case UserType.Portal: {
      name = PORTAL_USERS;

      const actionKey = `${ActionCategory.PortalUsers}${ActionSubject.Profile}${ActionName.Create}`;

      if (roleActionsMap[actionKey]) {
        primaryButtonLabel = INVITE_NEW_PORTAL_USER;
      }
      break;
    }

    case UserType.TDR: {
      name = TDR_USERS;

      const actionKey = `${ActionCategory.TDRUsers}${ActionSubject.Profile}${ActionName.Create}`;

      if (roleActionsMap[actionKey]) {
        primaryButtonLabel = INVITE_NEW_TDR_USER;
      }
      break;
    }

    case UserType.Archived:
      name = ARCHIVED_USERS;
      secondaryButtonLabel = undefined;
      primaryButtonLabel = undefined;
      onSelectRole = undefined;
      break;

    default:
      primaryButtonLabel = 'Assign Users';
      secondaryButtonLabel = 'Un-assign Users';
  }

  const toolbarProps: TableToolbarProps = {
    name,
    secondaryButtonLabel,
    primaryButtonLabel,
    isViewRole,
    roleOptions,
    onSelectRole,
    onClickPrimary: onClickInvite,
    onSearch,
  };

  if (!loading && isArchivedDashboard && users.length === 0) {
    return (
      <Empty image={<Exclamation />} description={false}>
        <EmptyText>
          No user have been archived yet.
          {/* {isViewRole
            ? 'assigned to this Role.'
            : isArchivedDashboard
            ? 'archived yet.'
            : 'registered yet.'} */}
        </EmptyText>
      </Empty>
    );
  }

  return (
    <div>
      <TableToolbar {...toolbarProps} />

      {isViewUsersPermitted ? (
        <Table
          columns={getColumns(
            router,
            isArchivedDashboard,
            popconfirmSubmitting,
            onUnarchive,
            roleActionsMap,
            userType,
          )}
          dataSource={users}
          rowSelection={isArchivedDashboard ? undefined : {}}
          loading={loading}
          rowClassName={classNames(styles.row, styles.cursorPointer)}
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
            let actionCategory = ActionCategory.PortalUsers;
            let suburl = ROUTE_DASHBOARD_PORTAL_USERS;

            if (record.type === UserType.TDR) {
              actionCategory = ActionCategory.TDRUsers;
              suburl = ROUTE_DASHBOARD_TDR_USERS;
            }

            let rowClickHandler: any = () => {
              router.push(`${suburl}/${record.id}`);
            };

            const viewUserActionKey = `${actionCategory}${ActionSubject.Profile}${ActionName.Read}`;

            if (!roleActionsMap[viewUserActionKey]) {
              rowClickHandler = undefined;
            }

            return {
              onClick: rowClickHandler,
            };
          }}
        />
      ) : (
        <Alert type="info" message="Not permitted!" showIcon />
      )}
    </div>
  );
};

export default UsersTable;
