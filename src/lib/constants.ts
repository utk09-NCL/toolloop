import type { Category, Condition, RequestStatus } from "@prisma/client";

/** Human-readable labels for Category enum values - never render raw enum strings in the UI. */
export const CATEGORY_LABELS: Record<Category, string> = {
  POWER_TOOLS: "Power tools",
  HAND_TOOLS: "Hand tools",
  GARDEN: "Garden",
  LADDERS: "Ladders",
  CLEANING: "Cleaning",
  AUTOMOTIVE: "Automotive",
  OTHER: "Other",
};

/** Human-readable labels for Condition enum values. */
export const CONDITION_LABELS: Record<Condition, string> = {
  NEW: "New",
  LIKE_NEW: "Like new",
  GOOD: "Good",
  FAIR: "Fair",
  WELL_USED: "Well used",
};

/** Human-readable labels for RequestStatus enum values. */
export const STATUS_LABELS: Record<RequestStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  RETURNED: "Returned",
  CANCELLED: "Cancelled",
};

/** All supported neighborhood names - used for seeding, validation, and filter options. */
export const NEIGHBORHOODS = ["Riverside", "Oak Hill", "Maple Court", "Cedar Flats"] as const;

export type Neighborhood = (typeof NEIGHBORHOODS)[number];

/** Canonical app routes - use these everywhere instead of bare strings. */
export const ROUTES = {
  HOME: "/",
  BROWSE: "/browse",
  TOOL_NEW: "/tools/new",
  TOOL: (id: string) => `/tools/${id}`,
  DASHBOARD: "/dashboard",
  BORROWS: "/borrows",
  SAVED: "/saved",
} as const;

/** Maximum number of PENDING borrow requests a single user may hold simultaneously. */
export const MAX_PENDING_REQUESTS = 3;
