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

type AuthContextProps = {
  user: IUser | null;
  authLoading: boolean;
  getUser: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextProps>({
  user: null,
  authLoading: false,
  getUser: () => {},
});

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  const getUser = useCallback(async () => {
    try {
      setAuthLoading(true);

      const token = Auth.getToken();

      if (!token) {
        setUser(null);
        return;
      }

      const user = await Auth.whoAmI();

      setUser(user);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <AuthContext.Provider value={{ user, authLoading, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
