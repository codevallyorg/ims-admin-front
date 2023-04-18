import { useRouter } from 'next/router';
import {
  createContext,
  FC,
  ReactNode,
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
} from '@/utils/constants';
import { preparePathname, showErrorNotification } from '@/utils/general';
import User from '@/services/user';

type PageHeaderContextProps = {
  loadingPageHeader: boolean;
  selectedUser: IUser | null;
  breadcrumbNameMap: Record<string, string>;
  getSelectedUser: () => void;
  rolePageHeaderBtnsClick: { onSave: () => void; onCancel: () => void };
};

type PageHeaderProviderProps = {
  children: ReactNode;
};

const PageHeaderContext = createContext<PageHeaderContextProps>({
  loadingPageHeader: false,
  selectedUser: null,
  breadcrumbNameMap: {},
  getSelectedUser: () => {},
  rolePageHeaderBtnsClick: { onSave: () => {}, onCancel: () => {} },
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
  const [breadcrumbNameMap, setBreadcrumbNameMap] = useState<
    Record<string, string>
  >(breadcrumbNameMapRecords);

  const rolePageHeaderBtnsClick = {
    onSave: () => {},
    onCancel: () => {},
  };

  const router = useRouter();
  const { pathname } = router;
  const { id } = router.query;

  const addIntoBreadcrumbNameMap = useCallback(
    (user: IUser) => {
      const preparedPath = preparePathname(pathname, user.id);

      if (breadcrumbNameMap[preparedPath] !== undefined) return;

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
    [pathname, breadcrumbNameMap],
  );

  const getSelectedUser = useCallback(async () => {
    try {
      setLoadingPageHeader(true);

      if (!id || isNaN(+id)) {
        setSelectedUser(null);
        return;
      }

      const user = await User.getUser(+id);

      addIntoBreadcrumbNameMap(user);

      setSelectedUser(user);
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err.message);
    } finally {
      setLoadingPageHeader(false);
    }
  }, [id, addIntoBreadcrumbNameMap]);

  useEffect(() => {
    getSelectedUser();
  }, [getSelectedUser]);

  return (
    <PageHeaderContext.Provider
      value={{
        breadcrumbNameMap,
        selectedUser,
        loadingPageHeader,
        getSelectedUser,
        rolePageHeaderBtnsClick,
      }}
    >
      {children}
    </PageHeaderContext.Provider>
  );
};

export const usePageHeaderContext = () => useContext(PageHeaderContext);
