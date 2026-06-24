import { authConfig } from "../../config/auth";
import type { AuthSession, AuthUser } from "../../types/domain";

const canUseStorage = () => typeof window !== "undefined" && Boolean(window.localStorage);

export const getStoredToken = () => {
  if (!canUseStorage()) {
    return null;
  }

  return window.localStorage.getItem(authConfig.tokenStorageKey);
};

export const getStoredUser = (): AuthUser | undefined => {
  if (!canUseStorage()) {
    return undefined;
  }

  const rawUser = window.localStorage.getItem(authConfig.userStorageKey);
  if (!rawUser) {
    return undefined;
  }

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    return undefined;
  }
};

export const storeSession = (session: AuthSession) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(authConfig.tokenStorageKey, session.accessToken);

  if (session.refreshToken) {
    window.localStorage.setItem(authConfig.refreshTokenStorageKey, session.refreshToken);
  }

  if (session.user) {
    window.localStorage.setItem(authConfig.userStorageKey, JSON.stringify(session.user));
  }
};

export const storeUser = (user: AuthUser) => {
  if (canUseStorage()) {
    window.localStorage.setItem(authConfig.userStorageKey, JSON.stringify(user));
  }
};

export const clearStoredSession = () => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(authConfig.tokenStorageKey);
  window.localStorage.removeItem(authConfig.refreshTokenStorageKey);
  window.localStorage.removeItem(authConfig.userStorageKey);
};
