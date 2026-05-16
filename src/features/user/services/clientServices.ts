import privateApi from "@/shared/api/axiosInstance";
import { toCamel } from "@/shared/lib/case";
import type { ApiResponse, MetaPagination } from "@/shared/types/common.type";
import type { Bid, JobAssignment } from "@/shared/types/entity.type";
import type { WorkerToReview } from "../types";

export const getClientJobs = async (
  page: number = 1,
  limit: number = 10,
  categorySlug?: string,
  status?: string,
) => {
  const response = await privateApi.get("/users/me/jobs", {
    params: {
      page,
      limit,
      categorySlug,
      status
    }
  });

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data pekerjaan");

  return toCamel(response.data) as (ApiResponse<JobAssignment[]> & {
      meta: {
        currentPage: number,
        perPage: number,
        total: number,
        lastPage: number
      }
    }
  );
};

export const getWorkersByJobId = async (jobId: string) => {
  const response = await privateApi.get(`/jobs/${jobId}/workers`);

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data pekerja");
  
  return toCamel(response.data.data) as ApiResponse<WorkerToReview[]>;
};

export const getBidsOfJob = async (
  page: number = 1,
  jobId: string,
  status?: string,
  limit?: number,
) => {
  const response = await privateApi.get(`/jobs/${jobId}/bids`, {
    params: {
      page,
      status,
      limit
    }
  });

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data penawaran");

  return toCamel(response.data) as ApiResponse<Bid[]> & { meta: MetaPagination };
};
