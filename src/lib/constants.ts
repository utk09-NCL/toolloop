import type { Category, Condition, RequestStatus } from "@prisma/client";

/** Routes used in the application */
export const ROUTES = {
  HOME: "/",
  BROWSE: "/browse",
  LIST_NEW_TOOL: "/tools/new",
  SAVED: "/saved",
  BORROWS: "/borrows",
  DASHBOARD: "/dashboard",
  LLMS_TXT: "/llms.txt",
};

/** Tool icons used in the hero section */
export const TOOL_ICONS = ["🔧", "🪚", "🔨", "🪜", "🌿", "🚿", "🔩", "🪛"];

/** Steps used in the "How it works" section */
export const STEPS = [
  {
    n: "1",
    title: "Browse what's nearby",
    desc: "See tools your neighbors are willing to lend. Filter by category, neighborhood, or availability.",
  },
  {
    n: "2",
    title: "Request to borrow",
    desc: "Send a quick message. The owner gets a notification and can approve or decline.",
  },
  {
    n: "3",
    title: "Pick it up and return it",
    desc: "Coordinate with the owner directly. When you're done, mark it returned and it's available again.",
  },
];

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
