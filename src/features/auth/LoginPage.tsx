import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Building2, LogIn } from "lucide-react";
import { Alert } from "../../components/ui/Alert";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { appBrand } from "../../config/navigation";
import { routes } from "../../config/routes";
import { getErrorMessage } from "../../api/errors";
import { login } from "./api";
import { useAuth } from "./AuthContext";
import { sanitizeRedirectPath } from "./redirects";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = sanitizeRedirectPath(new URLSearchParams(location.search).get("redirect"));

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }

    if (!password) {
      setError("Enter your password.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      const session = await login({ email: email.trim(), password });
      signIn(session);
      navigate(redirect, { replace: true });
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-5xl items-center gap-8 px-4 py-10 md:grid-cols-[1fr_0.9fr]">
      <section>
        <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-md bg-emerald-100 text-emerald-800">
          <Building2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <h1 className="text-4xl font-bold text-stone-950">{appBrand.name}</h1>
        <p className="mt-3 max-w-lg text-lg text-stone-600">{appBrand.tagline} Sign in to send inquiries and manage your profile.</p>
      </section>

      <form className="rounded-md border border-stone-200 bg-white p-6 shadow-soft" onSubmit={handleSubmit}>
        <div className="mb-6 flex items-center gap-3">
          <LogIn className="h-5 w-5 text-emerald-700" aria-hidden="true" />
          <div>
            <h2 className="text-xl font-semibold text-stone-950">Sign in</h2>
            <p className="text-sm text-stone-600">Use your marketplace account.</p>
          </div>
        </div>

        {error ? <Alert tone="error" message={error} className="mb-4" /> : null}

        <div className="grid gap-4">
          <Input label="Email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" disabled={isSubmitting} />
          <Input label="Password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" disabled={isSubmitting} />
          <Button type="submit" isLoading={isSubmitting}>
            Sign in
          </Button>
        </div>

        <p className="mt-5 text-sm text-stone-600">
          New here?{" "}
          <Link className="font-semibold text-emerald-800 hover:text-emerald-900" to={routes.register}>
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
};
