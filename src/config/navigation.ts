import { Building2, HeartHandshake, Home, LogIn, Search, UserRound } from "lucide-react";
import { routes } from "./routes";

export const appBrand = {
  name: "EstateLink",
  tagline: "Find spaces that fit real lives.",
};

export const publicNavigation = [
  { label: "Browse", to: routes.home, icon: Search },
  { label: "Sign in", to: routes.login, icon: LogIn },
  { label: "Register", to: routes.register, icon: UserRound },
];

export const authenticatedNavigation = [
  { label: "Browse", to: routes.home, icon: Home },
  { label: "My inquiries", to: routes.inquiries, icon: HeartHandshake },
  { label: "Profile", to: routes.profile, icon: Building2 },
];
