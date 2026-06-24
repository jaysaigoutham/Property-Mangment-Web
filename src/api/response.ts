import type { ApiListResult } from "../types/domain";

export const unwrapArray = <T>(payload: unknown): T[] => {
  if (Array.isArray(payload)) {
    return payload as T[];
  }

  if (!payload || typeof payload !== "object") {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const candidates = [record.items, record.data, record.results, record.value];
  const match = candidates.find(Array.isArray);

  return match ? (match as T[]) : [];
};

export const unwrapListResult = <T>(payload: unknown, mapper: (item: unknown, index: number) => T): ApiListResult<T> => {
  const rawItems = unwrapArray<unknown>(payload);
  const record = payload && typeof payload === "object" ? (payload as Record<string, unknown>) : {};

  return {
    items: rawItems.map(mapper),
    totalItems: asNumber(record.totalItems ?? record.totalCount ?? record.count),
    totalPages: asNumber(record.totalPages),
    page: asNumber(record.page ?? record.pageNumber),
    pageSize: asNumber(record.pageSize),
  };
};

export const asString = (value: unknown, fallback = "") => {
  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number") {
    return String(value);
  }

  return fallback;
};

export const asNumber = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
};

export const asStringArray = (value: unknown) => {
  if (Array.isArray(value)) {
    return value.map((item) => asString(item)).filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};
