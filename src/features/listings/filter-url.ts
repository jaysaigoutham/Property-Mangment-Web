import { defaultListingFilters } from "../../config/filters";
import type { ListingSearchFilters } from "../../types/domain";

const readNumber = (params: URLSearchParams, key: string, fallback: number) => {
  const value = Number(params.get(key));
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const filtersFromSearchParams = (params: URLSearchParams): ListingSearchFilters => ({
  q: params.get("q") ?? defaultListingFilters.q,
  city: params.get("city") ?? defaultListingFilters.city,
  country: params.get("country") ?? defaultListingFilters.country,
  propertyType: params.get("propertyType") ?? defaultListingFilters.propertyType,
  minPrice: params.get("minPrice") ?? defaultListingFilters.minPrice,
  maxPrice: params.get("maxPrice") ?? defaultListingFilters.maxPrice,
  bedrooms: params.get("bedrooms") ?? defaultListingFilters.bedrooms,
  page: readNumber(params, "page", defaultListingFilters.page),
  pageSize: readNumber(params, "pageSize", defaultListingFilters.pageSize),
});

export const filtersToSearchParams = (filters: ListingSearchFilters) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== undefined && value !== null) {
      params.set(key, String(value));
    }
  });

  return params;
};
