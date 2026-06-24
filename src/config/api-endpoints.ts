export const apiEndpoints = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    profile: "/auth/profile",
  },
  listings: {
    search: "/listings",
    byId: (listingId: string) => `/listings/${encodeURIComponent(listingId)}`,
  },
  media: {
    byListing: (listingId: string) => `/media/listings/${encodeURIComponent(listingId)}`,
  },
  inquiries: {
    create: "/inquiries",
    mine: "/inquiries/mine",
  },
};
