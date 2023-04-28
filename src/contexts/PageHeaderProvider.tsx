import { useRouter } from 'next/router';
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { IUser } from '@/types/entities/IUser';
import {
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
  ARCHIVED_USERS,
  INVITE_NEW_PORTAL_USER,
  INVITE_NEW_TDR_USER,
  PORTAL_USERS,
  TDR_USERS,
  USERS,
  EDIT_USER_PROFILE,
  ADMIN_PORTAL_SETTINGS,
  ROLE_MANAGEMENT,
  CREATE_NEW_ROLE,
  EDIT_ROLE,
  ROUTE_ROLE_MANAGEMENT,
} from '@/utils/constants';
import {
  preparePathname,
  showErrorNotification,
  showSentForApprovalNotification,
} from '@/utils/general';
import User from '@/services/user';
import { IRole } from '@/types/entities/IRole';
import Role from '@/services/role';

type BtnsClickActions = {
  onSave: () => void;
  onCancel: () => void;
};

type PageHeaderContextProps = {
  loadingPageHeader: boolean;
  breadcrumbNameMap: Record<string, string>;
  selectedUser: IUser | null;
  getSelectedUser: () => void;
  selectedRole: IRole | null;
  getSelectedRole: () => void;
  rolePageHeaderBtnsClick: BtnsClickActions;
  setRolePageHeaderBtnsClick: Dispatch<SetStateAction<BtnsClickActions>>;
};

type PageHeaderProviderProps = {
  children: ReactNode;
};

const PageHeaderContext = createContext<PageHeaderContextProps>({
  loadingPageHeader: false,
  breadcrumbNameMap: {},
  selectedUser: null,
  getSelectedUser: () => {},
  selectedRole: null,
  getSelectedRole: () => {},
  rolePageHeaderBtnsClick: { onSave: () => {}, onCancel: () => {} },
  setRolePageHeaderBtnsClick: () => {},
});

const breadcrumbNameMapRecords: Record<string, string> = {
  '/users': USERS,
  '/users/portal-users': PORTAL_USERS,
  '/users/portal-users/invite-new-portal-user': INVITE_NEW_PORTAL_USER,
  '/users/tdr-users': TDR_USERS,
  '/users/tdr-users/invite-new-tdr-user': INVITE_NEW_TDR_USER,
  '/users/archived-users': ARCHIVED_USERS,

  '/admin-portal-settings': ADMIN_PORTAL_SETTINGS,
  '/admin-portal-settings/role-management': ROLE_MANAGEMENT,
  '/admin-portal-settings/role-management/create-new-role': CREATE_NEW_ROLE,
};

export const PageHeaderProvider: FC<PageHeaderProviderProps> = ({
  children,
}) => {
  const [loadingPageHeader, setLoadingPageHeader] = useState<boolean>(true);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<IRole | null>(null);
  const [breadcrumbNameMap, setBreadcrumbNameMap] = useState<
    Record<string, string>
  >(breadcrumbNameMapRecords);
  const [rolePageHeaderBtnsClick, setRolePageHeaderBtnsClick] = useState({
    onSave: () => {},
    onCancel: () => {},
  });

  const router = useRouter();
  const { pathname } = router;
  const { id } = router.query;

  const addIntoBreadcrumbNameMap = useCallback(
    (user: IUser) => {
      const preparedPath = preparePathname(pathname, user.id);

      const newBreadcrumbRecords: Record<string, string> = {};

      const key = preparedPath.includes(ROUTE_DASHBOARD_PORTAL_USERS)
        ? `${ROUTE_DASHBOARD_PORTAL_USERS}/${user.id}`
        : preparedPath.includes(ROUTE_DASHBOARD_TDR_USERS)
        ? `${ROUTE_DASHBOARD_TDR_USERS}/${user.id}`
        : undefined;
      const value = `${user.firstName} ${user.lastName}`;

      if (key === undefined) return;

      newBreadcrumbRecords[key] = value;

      if (preparedPath.includes('edit-user-profile')) {
        newBreadcrumbRecords[preparedPath] = EDIT_USER_PROFILE;
      }

      setBreadcrumbNameMap((curRecords) => ({
        ...curRecords,
        ...newBreadcrumbRecords,
      }));
    },
    [pathname],
  );

  const getSelectedUser = useCallback(async () => {
    try {
      setLoadingPageHeader(true);

      if (!id || isNaN(+id)) {
        setSelectedUser(null);
        return;
      }

      const { data } = await User.getUser(+id);

      if (data.sentForApproval) {
        showSentForApprovalNotification();
        return;
      }

      addIntoBreadcrumbNameMap(data.result);

      setSelectedUser(data.result);
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err.message);
    } finally {
      setLoadingPageHeader(false);
    }
  }, [id, addIntoBreadcrumbNameMap]);

  const getSelectedRole = useCallback(async () => {
    try {
      setLoadingPageHeader(true);

      if (!id || isNaN(+id)) {
        setSelectedRole(null);
        return;
      }

      const role = await Role.getRole(+id);

      setSelectedRole(role);

      const route = `${ROUTE_ROLE_MANAGEMENT}/${id}`;

      const [key, value] = [route, role.name];
      const [keyForEdit, valueForEdit] = [`${route}/edit-role`, EDIT_ROLE];

      const newBreadcrumbRecords: Record<string, string> = {};

      newBreadcrumbRecords[key] = value;
      newBreadcrumbRecords[keyForEdit] = valueForEdit;

      setBreadcrumbNameMap((curMap) => ({
        ...curMap,
        ...newBreadcrumbRecords,
      }));
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err.message);
    } finally {
      setLoadingPageHeader(false);
    }
  }, [id]);

  useEffect(() => {
    if (router.pathname.includes('users')) {
      getSelectedUser();
    }

    if (router.pathname.includes('role-management')) {
      getSelectedRole();
    }
  }, [router, getSelectedUser, getSelectedRole]);

  return (
    <PageHeaderContext.Provider
      value={{
        breadcrumbNameMap,
        loadingPageHeader,
        selectedUser,
        getSelectedUser,
        selectedRole,
        getSelectedRole,
        rolePageHeaderBtnsClick,
        setRolePageHeaderBtnsClick,
      }}
    >
      {children}
    </PageHeaderContext.Provider>
  );
};

export const usePageHeaderContext = () => useContext(PageHeaderContext);
