import privateApi from "@/shared/api/axiosInstance";
import { toCamel } from "@/shared/lib/case";
import type { ApiResponse, MetaCursorPagination } from "@/shared/types/common.type";
import type { Category, JobAssignment } from "@/shared/types/entity.type";
import axios from "axios";

export interface JobsInfiniteResponse extends ApiResponse {
  data: JobAssignment[];
  meta: MetaCursorPagination;
}

export const getCategories = async () => {
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`);

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data kategori");

  return toCamel(response.data.data) as Category[];
}

export const getJobs = async ({
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
  const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`, {
    params: {
      cursor,
      limit,
      category_slug: categorySlug,
      city,
      budget_min: budgetMin,
      budget_max: budgetMax,
      date_from: dateFrom,
      date_to: dateTo,
      q,
    },
  });

  if (response.data.status !== "success")
    throw new Error(
      response.data?.message || "Gagal mengambil data pekerjaan",
    );

  return toCamel(response.data) as JobsInfiniteResponse;
}

export const getJobById = async (jobId: string) => {
  const response = await privateApi.get(`${import.meta.env.VITE_API_URL}/jobs/${jobId}`);

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data pekerjaan",);

  return toCamel(response?.data?.data) as JobAssignment;
}