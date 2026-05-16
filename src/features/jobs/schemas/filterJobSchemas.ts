import { z } from "zod";

const preprocessBudget = (val: unknown) => {
  if (val === "" || val === null || val === undefined) return undefined;
  const parsed = typeof val === "string" ? Number(val) : val;
  return Number.isNaN(parsed) ? undefined : parsed;
};

export const FilterJobSchema = z
  .object({
    categorySlug: z.string().optional(),
    city: z.string().optional(),
    budgetMin: z.preprocess(preprocessBudget, z.number().optional()),
    budgetMax: z.preprocess(preprocessBudget, z.number().optional()),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    q: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const { budgetMin, budgetMax } = data;
    if (
      typeof budgetMin === "number" &&
      typeof budgetMax === "number" &&
      budgetMin > budgetMax
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Rentang tidak valid",
        path: ["budgetMin"],
      });
    }
  });

export type FilterJobCredentials = z.infer<typeof FilterJobSchema>;
