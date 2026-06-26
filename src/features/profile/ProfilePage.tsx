import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Mail, Shield, UserRound } from "lucide-react";
import { getErrorMessage } from "../../api/errors";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { roleLabels } from "../../config/auth";
import { routes } from "../../config/routes";
import { getProfile } from "../auth/api";
import { useAuth } from "../auth/AuthContext";

export const ProfilePage = () => {
  const queryClient = useQueryClient();
  const { user, setProfile, signOut } = useAuth();
  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  useEffect(() => {
    if (profileQuery.data) {
      setProfile(profileQuery.data);
    }
  }, [profileQuery.data, setProfile]);

  const profile = profileQuery.data || user;
  const role = profile?.role && profile.role in roleLabels ? roleLabels[profile.role as keyof typeof roleLabels] : profile?.role;

  return (
    <div className="mx-auto grid max-w-4xl gap-6 px-4 py-8">
      <div>
        <p className="text-sm font-semibold uppercase text-emerald-700">Account</p>
        <h1 className="text-3xl font-bold text-stone-950">Profile</h1>
      </div>

      {profileQuery.isLoading && !profile ? <Spinner className="min-h-48 rounded-md border border-stone-200 bg-white" label="Loading profile" /> : null}
      {profileQuery.isError ? <Alert tone="error" message={getErrorMessage(profileQuery.error)} /> : null}

      {profile ? (
        <section className="rounded-md border border-stone-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div className="flex items-start gap-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
                <UserRound className="h-6 w-6" aria-hidden="true" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-stone-950">{profile.displayName || "Marketplace user"}</h2>
                <p className="mt-1 inline-flex items-center gap-2 text-sm text-stone-600">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                  {profile.email}
                </p>
              </div>
            </div>
            {role ? (
              <Badge tone="green">
                <Shield className="mr-1 h-3.5 w-3.5" aria-hidden="true" />
                {role}
              </Badge>
            ) : null}
          </div>

          {profileQuery.isFetching ? (
            <div className="mt-5">
              <Alert tone="info" message="Refreshing profile details..." />
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                signOut();
                queryClient.clear();
                window.location.assign(routes.home);
              }}
            >
              Logout
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
};
