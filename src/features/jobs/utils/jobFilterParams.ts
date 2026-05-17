export type JobFilterParams = {
  categorySlug?: string;
  city?: string;
  budgetMin?: number;
  budgetMax?: number;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
};

export const parseJobFilterParams = (
  searchParams: URLSearchParams,
): JobFilterParams => {
  const budgetMin = searchParams.get("budgetMin");
  const budgetMax = searchParams.get("budgetMax");

  return {
    categorySlug: searchParams.get("category") || undefined,
    city: searchParams.get("city") || undefined,
    budgetMin: budgetMin ? Number(budgetMin) : undefined,
    budgetMax: budgetMax ? Number(budgetMax) : undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    q: searchParams.get("q") || undefined,
  };
};

export const buildJobFilterSearchParams = (filters: JobFilterParams) => {
  const params = new URLSearchParams();

  if (filters.categorySlug) params.set("category", filters.categorySlug);
  if (filters.city) params.set("city", filters.city);
  if (filters.budgetMin !== undefined)
    params.set("budgetMin", String(filters.budgetMin));
  if (filters.budgetMax !== undefined)
    params.set("budgetMax", String(filters.budgetMax));
  if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
  if (filters.dateTo) params.set("dateTo", filters.dateTo);
  if (filters.q) params.set("q", filters.q);

  return params;
};
