export type UserRole = "buyer" | "agent" | "admin";

export interface AuthUser {
  id?: string;
  userId?: string;
  email: string;
  displayName?: string;
  role?: UserRole | string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  displayName: string;
  role: "buyer" | "agent";
}

export interface ListingSearchFilters {
  q: string;
  city: string;
  country: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  page: number;
  pageSize: number;
}

export interface Listing {
  id: string;
  title: string;
  description?: string;
  city?: string;
  state?: string;
  country?: string;
  addressLine?: string;
  price?: number;
  currency?: string;
  bedrooms?: number;
  bathrooms?: number;
  areaSqm?: number;
  propertyType?: string;
  amenities: string[];
  status?: string;
  imageUrl?: string;
  agentId?: string;
  agentName?: string;
  agentEmail?: string;
  agentPhone?: string;
}

export interface ListingMedia {
  id: string;
  listingId?: string;
  url: string;
  alt?: string;
  sortOrder?: number;
}

export interface AgentProfile {
  id?: string;
  agentId?: string;
  displayName?: string;
  agencyName?: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  bio?: string;
}

export interface Inquiry {
  id: string;
  listingId?: string;
  listingTitle?: string;
  message: string;
  status?: string;
  createdAt?: string;
}

export interface CreateInquiryRequest {
  listingId: string;
  message: string;
}

export interface ApiListResult<T> {
  items: T[];
  totalItems?: number;
  totalPages?: number;
  page?: number;
  pageSize?: number;
}
