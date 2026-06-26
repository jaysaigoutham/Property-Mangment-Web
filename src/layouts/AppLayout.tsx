import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Building2, LogOut, Menu } from "lucide-react";
import { Button } from "../components/ui/Button";
import { appBrand, authenticatedNavigation, publicNavigation } from "../config/navigation";
import { routes } from "../config/routes";
import { useAuth } from "../features/auth/AuthContext";
import { cn } from "../components/ui/cn";

export const AppLayout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, signOut } = useAuth();
  const navigation = isAuthenticated ? authenticatedNavigation : publicNavigation;

  const handleLogout = () => {
    signOut();
    queryClient.clear();
    navigate(routes.home);
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-950">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <Link className="flex items-center gap-2" to={routes.home}>
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-emerald-700 text-white">
              <Building2 className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-bold leading-5">{appBrand.name}</span>
              <span className="hidden text-xs text-stone-500 sm:block">{appBrand.tagline}</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {navigation.map((item) => (
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100 hover:text-stone-950",
                    isActive && "bg-emerald-50 text-emerald-800",
                  )
                }
                key={item.to}
                to={item.to}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
            {isAuthenticated ? (
              <Button variant="ghost" onClick={handleLogout}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Logout
              </Button>
            ) : null}
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            {user?.displayName ? <span className="max-w-28 truncate text-sm font-semibold text-stone-700">{user.displayName}</span> : null}
            <Menu className="h-5 w-5 text-stone-600" aria-hidden="true" />
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 pb-3 md:hidden" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-100",
                  isActive && "bg-emerald-50 text-emerald-800",
                )
              }
              key={item.to}
              to={item.to}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <Button className="shrink-0" variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Logout
            </Button>
          ) : null}
        </nav>
      </header>

      <Outlet />
    </div>
  );
};
