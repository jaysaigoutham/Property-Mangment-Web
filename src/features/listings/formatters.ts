import type { Listing } from "../../types/domain";

export const formatPrice = (listing: Listing) => {
  if (typeof listing.price !== "number") {
    return "Price on request";
  }

  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: listing.currency || "USD",
    maximumFractionDigits: 0,
  }).format(listing.price);
};

export const formatLocation = (listing: Listing) => [listing.city, listing.state, listing.country].filter(Boolean).join(", ") || "Location available on request";

export const getLocationParts = (listing: Listing) => [
  { label: "Address", value: listing.addressLine },
  { label: "City", value: listing.city },
  { label: "State", value: listing.state },
  { label: "Country", value: listing.country },
];

export const formatPropertyFacts = (listing: Listing) =>
  [
    listing.propertyType,
    listing.bedrooms ? `${listing.bedrooms} bed${listing.bedrooms === 1 ? "" : "s"}` : undefined,
    listing.bathrooms ? `${listing.bathrooms} bath${listing.bathrooms === 1 ? "" : "s"}` : undefined,
    listing.areaSqm ? `${listing.areaSqm} sqm` : undefined,
  ].filter(Boolean);
