import type { ListingSearchFilters } from "../types/domain";

export const defaultPageSize = 12;

export const defaultListingFilters: ListingSearchFilters = {
  q: "",
  city: "",
  country: "",
  propertyType: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  page: 1,
  pageSize: defaultPageSize,
};

export const propertyTypeOptions = [
  "Apartment",
  "House",
  "Villa",
  "Townhouse",
  "Land",
  "Commercial",
];

export const bedroomOptions = ["1", "2", "3", "4", "5+"];

export const pageSizeOptions = [6, 12, 24, 48];

export const locationPresets = [
  { label: "Colombo, Sri Lanka", city: "Colombo", country: "Sri Lanka" },
  { label: "Kandy, Sri Lanka", city: "Kandy", country: "Sri Lanka" },
  { label: "Galle, Sri Lanka", city: "Galle", country: "Sri Lanka" },
  { label: "Negombo, Sri Lanka", city: "Negombo", country: "Sri Lanka" },
];

export const priceRangePresets = [
  { label: "Any price", minPrice: "", maxPrice: "" },
  { label: "Under 100k", minPrice: "", maxPrice: "100000" },
  { label: "100k to 250k", minPrice: "100000", maxPrice: "250000" },
  { label: "250k to 500k", minPrice: "250000", maxPrice: "500000" },
  { label: "500k+", minPrice: "500000", maxPrice: "" },
];
