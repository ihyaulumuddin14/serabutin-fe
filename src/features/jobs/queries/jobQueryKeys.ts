export type JobListFilters = {
  cursor?: string;
  limit?: number;
  categorySlug?: string;
  city?: string;
  budgetMin?: number;
  budgetMax?: number;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
};

export const jobKeys = {
  all: ["jobs"] as const,
  categories: () => [...jobKeys.all, "categories"] as const,
  list: (filters: Omit<JobListFilters, "cursor">) =>
    [...jobKeys.all, "list", filters] as const,
  listCursor: (filters: JobListFilters) =>
    [...jobKeys.all, "list-cursor", filters] as const,
  detail: (jobId: string) => [...jobKeys.all, "detail", jobId] as const,
};
