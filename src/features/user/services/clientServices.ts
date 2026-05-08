import privateApi from "@/shared/api/axiosInstance";
import { toCamel } from "@/shared/lib/case";
import type { ApiResponse } from "@/shared/types/common.type";
import type { JobAssignment } from "@/shared/types/entity.type";

export const getClientJobs = async (page: number = 1, limit: number = 10, categorySlug?: string, status?: string) => {
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
}

export const getWorkerAssignments = async (page: number = 1, limit: number = 10, categorySlug?: string, status?: string) => {
  const response = await privateApi.get("/users/me/assignments", {
    params: {
      page,
      limit,
      categorySlug,
      status
    }
  });

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data pekerjaan");

  return toCamel(response.data) as ApiResponse<JobAssignment[]> & {
    meta: {
      currentPage: number,
      perPage: number,
      total: number,
      lastPage: number
    }
  };
}

export const getWorkersByJobId = async (jobId: string) => {
  const response = await privateApi.get(`/jobs/${jobId}/workers`);

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data pekerja");

  return toCamel(response.data.data) 
}