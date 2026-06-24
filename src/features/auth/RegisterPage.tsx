import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserRoundPlus } from "lucide-react";
import { getErrorMessage } from "../../api/errors";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { routes } from "../../config/routes";
import { register } from "./api";
import { useAuth } from "./AuthContext";

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "agent">("buyer");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!displayName || !email || !password) {
      setError("Complete all required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await register({ displayName, email, password, role });
      signIn(session);
      navigate(routes.profile, { replace: true });
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <form className="rounded-md border border-stone-200 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
        <div className="mb-6 flex items-center gap-3">
          <UserRoundPlus className="h-5 w-5 text-emerald-700" aria-hidden="true" />
          <div>
            <h1 className="text-2xl font-semibold text-stone-950">Create account</h1>
            <p className="text-sm text-stone-600">Register as a buyer or agent.</p>
          </div>
        </div>

        {error ? <Alert tone="error" message={error} className="mb-4" /> : null}

        <div className="grid gap-4">
          <Input label="Display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} autoComplete="name" />
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
          <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" />
          <Select
            label="Account type"
            value={role}
            onChange={(event) => setRole(event.target.value as "buyer" | "agent")}
            options={[
              { label: "Buyer", value: "buyer" },
              { label: "Agent", value: "agent" },
            ]}
          />
          <Button type="submit" isLoading={isSubmitting}>
            Create account
          </Button>
        </div>

        <p className="mt-5 text-sm text-stone-600">
          Already registered?{" "}
          <Link className="font-semibold text-emerald-800 hover:text-emerald-900" to={routes.login}>
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};
