import privateApi from "@/shared/api/axiosInstance";
import { toCamel, toSnake } from "@/shared/lib/case";
import type {
  ApiResponse,
  JobStatus,
  MetaCursorPagination,
} from "@/shared/types/common.type";
import type { Category, JobAssignment } from "@/shared/types/entity.type";
import axios from "axios";
import type {
  EditJobCredentials,
  PostJobCredentials,
} from "../schemas/postJobSchemas";
import { ensureSuccess } from "../utils/jobServiceUtils";

export interface JobsInfiniteResponse extends ApiResponse {
  data: JobAssignment[];
  meta: MetaCursorPagination;
}

const jobsBaseUrl = `${import.meta.env.VITE_API_URL}`;

export const getCategories = async () => {
  const response = await axios.get(`${jobsBaseUrl}/categories`);

  const data = ensureSuccess(response, "Gagal mengambil data kategori");
  return toCamel(data.data) as Category[];
};

export const getJobs = async ({
  cursor,
  limit = 10,
  categorySlug,
  city,
  budgetMin,
  budgetMax,
  dateFrom,
  dateTo,
  q,
}: {
  limit?: number;
  page?: number;
  categorySlug?: string;
  cursor?: string;
  city?: string;
  budgetMin?: number;
  budgetMax?: number;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
}) => {
  const response = await axios.get(`${jobsBaseUrl}/jobs`, {
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

  const data = ensureSuccess(response, "Gagal mengambil data pekerjaan");
  return toCamel(data) as JobsInfiniteResponse;
};

export const getJobById = async (jobId: string) => {
  const response = await privateApi.get(`/jobs/${jobId}`);

  const data = ensureSuccess(response, "Gagal mengambil data pekerjaan");
  return toCamel(data.data) as JobAssignment;
};

export const postJob = async (payload: PostJobCredentials) => {
  const convertedPayload = toSnake(payload);

  const response = await privateApi.post(`/jobs`, convertedPayload);

  const data = ensureSuccess(response, "Gagal memposting kebutuhan jasa");
  return toCamel(data) as ApiResponse<JobAssignment>;
};

export const editJob = async (jobId: string, payload: EditJobCredentials) => {
  const convertedPayload = toSnake(payload);

  const response = await privateApi.patch(`/jobs/${jobId}`, convertedPayload);

  const data = ensureSuccess(response, "Gagal mengedit pekerjaan");
  return toCamel(data) as ApiResponse<JobAssignment>;
};

export const deleteJob = async (jobId: string) => {
  const response = await privateApi.delete(`/jobs/${jobId}`);
  return ensureSuccess(response, "Gagal menghapus pekerjaan");
};

export const updateJobStatus = async (jobId: string, status: JobStatus) => {
  const response = await privateApi.patch(`/jobs/${jobId}/status`, { status });

  const data = ensureSuccess(response, "Gagal memperbarui status pekerjaan");
  return toCamel(data) as ApiResponse<JobAssignment>;
};
