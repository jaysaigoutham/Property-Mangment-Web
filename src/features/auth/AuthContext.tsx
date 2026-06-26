import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { AuthSession, AuthUser } from "../../types/domain";
import { clearStoredSession, getStoredToken, getStoredUser, storeSession, storeUser } from "./auth-storage";
import { getProfile } from "./api";

interface AuthContextValue {
  token: string | null;
  user?: AuthUser;
  isAuthenticated: boolean;
  isHydratingProfile: boolean;
  signIn: (session: AuthSession) => void;
  setProfile: (user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => getStoredToken());
  const [user, setUser] = useState<AuthUser | undefined>(() => getStoredUser());
  const [isHydratingProfile, setIsHydratingProfile] = useState(() => Boolean(getStoredToken() && !getStoredUser()));

  useEffect(() => {
    let isMounted = true;

    if (!token || user) {
      setIsHydratingProfile(false);
      return () => {
        isMounted = false;
      };
    }

    setIsHydratingProfile(true);
    getProfile()
      .then((profile) => {
        if (!isMounted) {
          return;
        }

        if (profile) {
          storeUser(profile);
          setUser(profile);
        }
      })
      .catch(() => {
        if (isMounted) {
          clearStoredSession();
          setToken(null);
          setUser(undefined);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsHydratingProfile(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [token, user]);

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
      isHydratingProfile,
      signIn,
      setProfile,
      signOut,
    }),
    [token, user, isHydratingProfile, signIn, setProfile, signOut],
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
