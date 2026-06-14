import type { Category, Condition } from "@prisma/client";
import { z } from "zod";
import { CATEGORY_LABELS, CONDITION_LABELS } from "./constants";

const CATEGORY_VALUES = Object.keys(CATEGORY_LABELS) as [Category, ...Category[]];
const CONDITION_VALUES = Object.keys(CONDITION_LABELS) as [Condition, ...Condition[]];

/** Zod schema for the create-tool form - validates all fields before a DB write. */
export const createToolSchema = z.object({
  name: z.string().min(2, "Name is required").max(80),
  category: z.string().min(1, "Please select a category").pipe(z.enum(CATEGORY_VALUES)),
  condition: z.string().min(1, "Please select a condition").pipe(z.enum(CONDITION_VALUES)),
  description: z.string().min(10, "Add a short description").max(600),
  neighborhood: z.string().min(1, "Please select a neighborhood"),
  rules: z.string().max(300).default(""),
});

/** Zod schema for a borrow request submission - toolId is required, message is optional. */
export const createRequestSchema = z.object({
  toolId: z.string().min(1),
  message: z.string().max(300).optional(),
});

export type CreateToolInput = z.infer<typeof createToolSchema>;
