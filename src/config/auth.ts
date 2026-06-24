import { routes } from "./routes";

export const authConfig = {
  tokenStorageKey: "property_marketplace_access_token",
  refreshTokenStorageKey: "property_marketplace_refresh_token",
  userStorageKey: "property_marketplace_user",
  loginRedirectPath: routes.login,
  postLoginPath: routes.home,
  protectedRoutes: [routes.profile, routes.inquiries],
};

export const roleLabels = {
  buyer: "Buyer",
  agent: "Agent",
  admin: "Admin",
} as const;
