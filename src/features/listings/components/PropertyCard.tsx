import { Link } from "react-router-dom";
import { BedDouble, MapPin, Ruler, ShowerHead } from "lucide-react";
import { Badge } from "../../../components/ui/Badge";
import { fallbackPropertyImages } from "../../../config/media";
import { routes } from "../../../config/routes";
import type { Listing } from "../../../types/domain";
import { formatLocation, formatPrice } from "../formatters";

const fallbackImageFor = (listingId: string) => {
  const index = listingId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % fallbackPropertyImages.length;
  return fallbackPropertyImages[index];
};

export const PropertyCard = ({ listing }: { listing: Listing }) => (
  <Link className="group grid overflow-hidden rounded-md border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft" to={routes.listingDetails(listing.id)}>
    <div className="aspect-[4/3] overflow-hidden bg-stone-100">
      <img
        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        src={listing.imageUrl || fallbackImageFor(listing.id)}
        alt={listing.title}
        loading="lazy"
      />
    </div>

    <div className="grid gap-4 p-4">
      <div>
        <div className="mb-2 flex flex-wrap gap-2">
          {listing.propertyType ? <Badge tone="green">{listing.propertyType}</Badge> : null}
          {listing.status ? <Badge tone="sky">{listing.status}</Badge> : null}
        </div>
        <h2 className="line-clamp-2 text-lg font-semibold text-stone-950">{listing.title}</h2>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-stone-600">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
          {formatLocation(listing)}
        </p>
      </div>

      <div className="text-xl font-bold text-stone-950">{formatPrice(listing)}</div>

      <div className="grid grid-cols-3 gap-2 text-xs font-medium text-stone-600">
        <span className="inline-flex items-center gap-1">
          <BedDouble className="h-4 w-4 text-stone-500" aria-hidden="true" />
          {listing.bedrooms ?? "-"} beds
        </span>
        <span className="inline-flex items-center gap-1">
          <ShowerHead className="h-4 w-4 text-stone-500" aria-hidden="true" />
          {listing.bathrooms ?? "-"} baths
        </span>
        <span className="inline-flex items-center gap-1">
          <Ruler className="h-4 w-4 text-stone-500" aria-hidden="true" />
          {listing.areaSqm ?? "-"} sqm
        </span>
      </div>
    </div>
  </Link>
);
