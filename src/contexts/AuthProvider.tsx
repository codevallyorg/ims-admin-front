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
import Auth from '@/services/auth';
import Role from '@/services/role';
import { IAction } from '@/types/entities/IAction';

export type RoleActionsMap = Record<string, boolean>;

type AuthContextProps = {
  user: IUser | null;
  roleActionsMap: RoleActionsMap;
  authLoading: boolean;
  getUserWithRole: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextProps>({
  user: null,
  roleActionsMap: {},
  authLoading: false,
  getUserWithRole: () => {},
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [roleActionsMap, setRoleActionsMap] = useState<RoleActionsMap>({});
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const getUserWithRole = useCallback(async () => {
    try {
      setAuthLoading(true);

      const token = Auth.getToken();

      if (!token) {
        setUser(null);
        setRoleActionsMap({});
        return;
      }

      const user = await Auth.whoAmI();

      const role = await Role.getRole(user.roleId);

      const newRoleActionsMap: RoleActionsMap = {};

      role.RoleActions.forEach((roleAction: any) => {
        const action: IAction = roleAction.action;
        const { category, subject, name } = action;

        const actionKey = `${category}${subject}${name}`;

        newRoleActionsMap[actionKey] = true;
      });

      setUser(user);
      setRoleActionsMap(newRoleActionsMap);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    getUserWithRole();
  }, [getUserWithRole]);

  return (
    <AuthContext.Provider
      value={{ user, roleActionsMap, authLoading, getUserWithRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
