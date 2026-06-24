import { apiEndpoints } from "../../config/api-endpoints";
import { apiRequest } from "../../api/http-client";
import { asString, unwrapArray } from "../../api/response";
import type { CreateInquiryRequest, Inquiry } from "../../types/domain";

export const normalizeInquiry = (value: unknown, fallbackId = "inquiry"): Inquiry => {
  const record = value && typeof value === "object" ? (value as Record<string, unknown>) : {};
  const listing = record.listing && typeof record.listing === "object" ? (record.listing as Record<string, unknown>) : {};

  return {
    id: asString(record.id || record.inquiryId, fallbackId),
    listingId: asString(record.listingId || listing.id || listing.listingId) || undefined,
    listingTitle: asString(record.listingTitle || listing.title) || undefined,
    message: asString(record.message),
    status: asString(record.status) || undefined,
    createdAt: asString(record.createdAt || record.createdAtUtc) || undefined,
  };
};

export const createInquiry = async (request: CreateInquiryRequest) =>
  apiRequest<unknown>(apiEndpoints.inquiries.create, {
    method: "POST",
    body: request,
  });

export const getMyInquiries = async () => {
  const payload = await apiRequest<unknown>(apiEndpoints.inquiries.mine);
  return unwrapArray<unknown>(payload).map((item, index) => normalizeInquiry(item, `inquiry-${index}`));
};
