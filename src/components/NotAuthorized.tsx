import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { routes } from "../config/routes";

export const NotAuthorized = () => (
  <div className="mx-auto grid min-h-[calc(100vh-8rem)] max-w-xl place-items-center px-4 py-10">
    <section className="rounded-md border border-stone-200 bg-white p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 inline-flex h-12 w-12 items-center justify-center rounded-md bg-rose-100 text-rose-800">
        <ShieldAlert className="h-6 w-6" aria-hidden="true" />
      </div>
      <h1 className="text-2xl font-bold text-stone-950">Not authorized</h1>
      <p className="mt-2 text-stone-600">Your account does not have permission to view this page.</p>
      <Link
        className="mt-5 inline-flex min-h-10 items-center justify-center rounded-md border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-100"
        to={routes.home}
      >
        Return to listings
      </Link>
    </section>
  </div>
);
