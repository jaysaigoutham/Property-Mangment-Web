import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { AuthSession, AuthUser } from "../../types/domain";
import { clearStoredSession, getStoredToken, getStoredUser, storeSession, storeUser } from "./auth-storage";

interface AuthContextValue {
  token: string | null;
  user?: AuthUser;
  isAuthenticated: boolean;
  signIn: (session: AuthSession) => void;
  setProfile: (user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | undefined>(() => getStoredUser());

  const signIn = useCallback((session: AuthSession) => {
    storeSession(session);
    setToken(session.accessToken);
    setUser(session.user);
  }, []);

  const setProfile = useCallback((nextUser: AuthUser) => {
    storeUser(nextUser);
    setUser(nextUser);
  }, []);

  const signOut = useCallback(() => {
    clearStoredSession();
    setToken(null);
    setUser(undefined);
  }, []);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      signIn,
      setProfile,
      signOut,
    }),
    [token, user, signIn, setProfile, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
};
