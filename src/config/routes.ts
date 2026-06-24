export const routePaths = {
  home: "/",
  login: "/login",
  register: "/register",
  profile: "/profile",
  inquiries: "/inquiries",
  notAuthorized: "/not-authorized",
  listingDetails: "/listings/:listingId",
};

export const routes = {
  home: routePaths.home,
  login: routePaths.login,
  register: routePaths.register,
  profile: routePaths.profile,
  inquiries: routePaths.inquiries,
  notAuthorized: routePaths.notAuthorized,
  listingDetails: (listingId: string) => `/listings/${encodeURIComponent(listingId)}`,
};
