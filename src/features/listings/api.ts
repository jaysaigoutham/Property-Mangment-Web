import { apiEndpoints } from "../../config/api-endpoints";
import { apiRequest } from "../../api/http-client";
import { asNumber, asString, asStringArray, unwrapArray, unwrapListResult } from "../../api/response";
import type { ApiListResult, AgentProfile, Listing, ListingMedia, ListingSearchFilters } from "../../types/domain";

const normalizeAgent = (value: unknown): Partial<AgentProfile> => {
  if (!value || typeof value !== "object") {
    return {};
  }

  const record = value as Record<string, unknown>;

  return {
    id: asString(record.id) || undefined,
    agentId: asString(record.agentId) || undefined,
    displayName: asString(record.displayName || record.name) || undefined,
    agencyName: asString(record.agencyName) || undefined,
    phone: asString(record.phone) || undefined,
    email: asString(record.email) || undefined,
  };
};

export const normalizeListing = (value: unknown, fallbackId = "listing"): Listing => {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const agent = normalizeAgent(record.agent);
  const rawImages = unwrapArray<Record<string, unknown>>(record.images);
  const firstImage = rawImages[0];

  return {
    id: asString(record.id || record.listingId || record.slug, fallbackId),
    title: asString(record.title, "Untitled property"),
    description: asString(record.description) || undefined,
    city: asString(record.city) || undefined,
    state: asString(record.state) || undefined,
    country: asString(record.country) || undefined,
    addressLine: asString(record.addressLine || record.address) || undefined,
    price: asNumber(record.price),
    currency: asString(record.currency, "USD"),
    bedrooms: asNumber(record.bedrooms),
    bathrooms: asNumber(record.bathrooms),
    areaSqm: asNumber(record.areaSqm || record.area),
    propertyType: asString(record.propertyType) || undefined,
    amenities: asStringArray(record.amenities),
    status: asString(record.status) || undefined,
    imageUrl: asString(record.imageUrl || record.primaryImageUrl || record.thumbnailUrl || firstImage?.url || firstImage?.imageUrl) || undefined,
    agentId: asString(record.agentId || agent.agentId || agent.id) || undefined,
    agentName: asString(record.agentName || agent.displayName || agent.agencyName) || undefined,
    agentEmail: asString(record.agentEmail || agent.email) || undefined,
    agentPhone: asString(record.agentPhone || agent.phone) || undefined,
  };
};

export const normalizeMedia = (value: unknown, fallbackId = "media"): ListingMedia => {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};

  return {
    id: asString(record.id || record.mediaId, fallbackId),
    listingId: asString(record.listingId) || undefined,
    url: asString(record.url || record.imageUrl || record.publicUrl || record.blobUrl),
    alt: asString(record.alt || record.fileName) || undefined,
    sortOrder: asNumber(record.sortOrder),
  };
};

export const searchListings = async (filters: ListingSearchFilters): Promise<ApiListResult<Listing>> => {
  const payload = await apiRequest<unknown>(apiEndpoints.listings.search, {
    auth: false,
    params: filters,
  });

  return unwrapListResult(payload, (item, index) => normalizeListing(item, `listing-${index}`));
};

export const getListing = async (listingId: string) => {
  const payload = await apiRequest<unknown>(apiEndpoints.listings.byId(listingId), {
    auth: false,
  });

  return normalizeListing(payload, listingId);
};

export const getListingMedia = async (listingId: string) => {
  const payload = await apiRequest<unknown>(apiEndpoints.media.byListing(listingId), {
    auth: false,
  });

  return unwrapArray<unknown>(payload)
    .map((item, index) => normalizeMedia(item, `media-${index}`))
    .filter((media) => media.url)
    .sort((left, right) => (left.sortOrder ?? 0) - (right.sortOrder ?? 0));
};
