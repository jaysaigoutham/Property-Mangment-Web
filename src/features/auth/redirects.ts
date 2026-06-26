import { routes } from "../../config/routes";

export const sanitizeRedirectPath = (value: string | null | undefined) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return routes.home;
  }

  try {
    const parsed = new URL(value, window.location.origin);
    return parsed.origin === window.location.origin ? `${parsed.pathname}${parsed.search}${parsed.hash}` : routes.home;
  } catch {
    return routes.home;
  }
};
