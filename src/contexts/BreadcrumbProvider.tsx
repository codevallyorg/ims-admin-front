import {
  ARCHIVED_USERS,
  INVITE_NEW_PORTAL_USER,
  PORTAL_USERS,
  TDR_USERS,
  USERS,
} from '@/utils/constants';
import {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';

type BreadcrumbContextProps = {
  breadcrumbNameMap: Record<string, string>;
  setBreadcrumbNameMap: Dispatch<SetStateAction<Record<string, string>>>;
};

type BreadcrumbProviderProps = {
  children: ReactNode;
};

const BreadcrumbContext = createContext<BreadcrumbContextProps>({
  breadcrumbNameMap: {},
  setBreadcrumbNameMap: () => {},
});

const breadcrumbNameMapRecords: Record<string, string> = {
  '/users': USERS,
  '/users/portal-users': PORTAL_USERS,
  '/users/portal-users/invite-new-portal-user': INVITE_NEW_PORTAL_USER,
  '/users/tdr-users': TDR_USERS,
  '/users/archived-users': ARCHIVED_USERS,
};

export const BreadcrumbProvider: FC<BreadcrumbProviderProps> = ({
  children,
}) => {
  const [breadcrumbNameMap, setBreadcrumbNameMap] = useState<
    Record<string, string>
  >(breadcrumbNameMapRecords);

  return (
    <BreadcrumbContext.Provider
      value={{ breadcrumbNameMap, setBreadcrumbNameMap }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
};

export const useBreadcrumbContext = () => useContext(BreadcrumbContext);
