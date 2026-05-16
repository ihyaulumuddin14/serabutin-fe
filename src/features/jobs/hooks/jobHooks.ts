import { useQuery } from "@tanstack/react-query";
import { getCategories, getJobById, getJobs } from "../services/jobServices";

export const useCategory = () => {
  return useQuery({
    queryKey: ["category"],
    queryFn: getCategories
  })
}

export const useGetJobs = ({
  cursor,
  limit = 10,
  categorySlug,
  city,
  budgetMin,
  budgetMax,
  dateFrom,
  dateTo,
  q
}: {
  limit?: number,
  page?: number,
  categorySlug?: string,
  cursor?: string,
  city?: string,
  budgetMin?: number,
  budgetMax?: number,
  dateFrom?: string,
  dateTo?: string,
  q?: string
}) => {
  return useQuery({
    queryKey: ["jobs", cursor, categorySlug, city, budgetMin, budgetMax, dateFrom, dateTo, q],
    queryFn: () => getJobs({
      cursor,
      limit,
      categorySlug,
      city,
      budgetMin,
      budgetMax,
      dateFrom,
      dateTo,
      q
    }),
    retry: false
  })
}

export const useGetJobById = (jobId: string = "fe463126-5d81-44b8-a798-56032046fbd2") => {
  return useQuery({
    queryKey: ["job", jobId],
    queryFn: () => getJobById(jobId),
    retry: false
  })
}