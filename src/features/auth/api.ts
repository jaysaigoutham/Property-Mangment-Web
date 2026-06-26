import { apiEndpoints } from "../../config/api-endpoints";
import { apiRequest } from "../../api/http-client";
import { asString } from "../../api/response";
import { storeSession } from "./auth-storage";
import type { AuthSession, AuthUser, LoginRequest, RegisterRequest } from "../../types/domain";

export const normalizeUser = (payload: unknown): AuthUser | undefined => {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  const record = payload as Record<string, unknown>;
  const source = (
    record.user && typeof record.user === "object"
      ? record.user
      : record.profile && typeof record.profile === "object"
        ? record.profile
        : record.data && typeof record.data === "object"
          ? record.data
          : record
  ) as Record<string, unknown>;
  const email = asString(source.email);

  if (!email) {
    return undefined;
  }

  return {
    id: asString(source.id) || undefined,
    userId: asString(source.userId) || undefined,
    email,
    displayName: asString(source.displayName || source.name) || undefined,
    role: asString(source.role) || undefined,
  };
};

const normalizeAuthSession = (payload: unknown): AuthSession => {
  if (!payload || typeof payload !== "object") {
    throw new Error("Authentication response did not include a token.");
  }

  const record = payload as Record<string, unknown>;
  const tokenSource = record.auth && typeof record.auth === "object" ? (record.auth as Record<string, unknown>) : record;
  const accessToken = asString(record.accessToken || record.token || record.jwt || tokenSource.accessToken || tokenSource.token || tokenSource.jwt);

  if (!accessToken) {
    throw new Error("Authentication response did not include an access token.");
  }

  return {
    accessToken,
    refreshToken: asString(record.refreshToken || tokenSource.refreshToken) || undefined,
    user: normalizeUser(payload),
  };
};

const withProfileFallback = async (session: AuthSession) => {
  if (session.user) {
    return session;
  }

  storeSession(session);
  const user = await getProfile();

  return {
    ...session,
    user,
  };
};

export const login = async (request: LoginRequest) => {
  const payload = await apiRequest<unknown>(apiEndpoints.auth.login, {
    method: "POST",
    auth: false,
    body: request,
  });

  return withProfileFallback(normalizeAuthSession(payload));
};

export const register = async (request: RegisterRequest) => {
  const payload = await apiRequest<unknown>(apiEndpoints.auth.register, {
    method: "POST",
    auth: false,
    body: request,
  });

  return withProfileFallback(normalizeAuthSession(payload));
};

export const getProfile = async () => {
  const payload = await apiRequest<unknown>(apiEndpoints.auth.profile);
  return normalizeUser(payload);
};
