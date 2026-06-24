import { Link, useNavigate, useParams } from "react-router-dom";
import type { ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BedDouble, CheckCircle2, Mail, MapPin, Phone, Ruler, ShowerHead } from "lucide-react";
import { getErrorMessage } from "../../api/errors";
import { Alert } from "../../components/ui/Alert";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner } from "../../components/ui/Spinner";
import { routes } from "../../config/routes";
import { useAuth } from "../auth/AuthContext";
import { InquiryForm } from "../inquiries/InquiryForm";
import { getListing, getListingMedia } from "./api";
import { formatLocation, formatPrice, formatPropertyFacts } from "./formatters";
import { ListingGallery } from "./components/ListingGallery";

export const ListingDetailsPage = () => {
  const { listingId = "" } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const listingQuery = useQuery({
    queryKey: ["listing", listingId],
    queryFn: () => getListing(listingId),
    enabled: Boolean(listingId),
  });

  const mediaQuery = useQuery({
    queryKey: ["listing-media", listingId],
    queryFn: () => getListingMedia(listingId),
    enabled: Boolean(listingId),
  });

  if (listingQuery.isLoading) {
    return <Spinner className="min-h-[calc(100vh-8rem)]" label="Loading property" />;
  }

  if (listingQuery.isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Alert tone="error" message={getErrorMessage(listingQuery.error)} />
      </div>
    );
  }

  const listing = listingQuery.data;

  if (!listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Alert tone="error" message="Property could not be found." />
      </div>
    );
  }

  const facts = formatPropertyFacts(listing);

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-8">
      <Link className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-900" to={routes.home}>
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to listings
      </Link>

      <ListingGallery listing={listing} media={mediaQuery.data ?? []} />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <main className="grid gap-6">
          <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex flex-wrap gap-2">
              {listing.propertyType ? <Badge tone="green">{listing.propertyType}</Badge> : null}
              {listing.status ? <Badge tone="sky">{listing.status}</Badge> : null}
            </div>
            <h1 className="text-3xl font-bold text-stone-950">{listing.title}</h1>
            <p className="mt-3 flex items-start gap-2 text-stone-600">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
              {listing.addressLine ? `${listing.addressLine}, ` : ""}
              {formatLocation(listing)}
            </p>
            <div className="mt-5 text-3xl font-bold text-stone-950">{formatPrice(listing)}</div>

            <div className="mt-6 grid gap-3 sm:grid-cols-4">
              <Fact icon={<BedDouble className="h-5 w-5" />} label="Bedrooms" value={listing.bedrooms ?? "-"} />
              <Fact icon={<ShowerHead className="h-5 w-5" />} label="Bathrooms" value={listing.bathrooms ?? "-"} />
              <Fact icon={<Ruler className="h-5 w-5" />} label="Area" value={listing.areaSqm ? `${listing.areaSqm} sqm` : "-"} />
              <Fact icon={<CheckCircle2 className="h-5 w-5" />} label="Type" value={listing.propertyType ?? "-"} />
            </div>
          </section>

          <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">Description</h2>
            <p className="mt-3 whitespace-pre-line text-stone-700">{listing.description || "No description has been provided for this property."}</p>
          </section>

          <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
            <h2 className="text-xl font-semibold text-stone-950">Amenities</h2>
            {listing.amenities.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {listing.amenities.map((amenity) => (
                  <Badge key={amenity}>{amenity}</Badge>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-stone-600">Amenities are not listed yet.</p>
            )}
          </section>

          {facts.length ? (
            <section className="rounded-md border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-stone-950">Property summary</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {facts.map((fact) => (
                  <Badge tone="amber" key={fact}>
                    {fact}
                  </Badge>
                ))}
              </div>
            </section>
          ) : null}
        </main>

        <aside className="grid h-fit gap-4">
          <section className="rounded-md border border-stone-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-stone-950">Agent information</h2>
            <div className="mt-3 grid gap-2 text-sm text-stone-600">
              <p className="font-semibold text-stone-900">{listing.agentName || "Property agent"}</p>
              {listing.agentEmail ? (
                <p className="inline-flex items-center gap-2">
                  <Mail className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  {listing.agentEmail}
                </p>
              ) : null}
              {listing.agentPhone ? (
                <p className="inline-flex items-center gap-2">
                  <Phone className="h-4 w-4 text-emerald-700" aria-hidden="true" />
                  {listing.agentPhone}
                </p>
              ) : null}
            </div>
          </section>

          {isAuthenticated ? (
            <InquiryForm listingId={listing.id} />
          ) : (
            <section className="grid gap-3 rounded-md border border-stone-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-stone-950">Contact the agent</h2>
              <p className="text-sm text-stone-600">Sign in to send an inquiry about this property.</p>
              <Button onClick={() => navigate(`${routes.login}?redirect=${encodeURIComponent(routes.listingDetails(listing.id))}`)}>
                Sign in to inquire
              </Button>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

const Fact = ({ icon, label, value }: { icon: ReactNode; label: string; value: ReactNode }) => (
  <div className="rounded-md border border-stone-200 bg-stone-50 p-3">
    <div className="mb-2 text-emerald-700">{icon}</div>
    <p className="text-xs font-semibold uppercase text-stone-500">{label}</p>
    <p className="mt-1 text-sm font-semibold text-stone-950">{value}</p>
  </div>
);
