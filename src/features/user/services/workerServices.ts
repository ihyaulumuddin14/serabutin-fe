import privateApi from "@/shared/api/axiosInstance";
import { toCamel } from "@/shared/lib/case";
import type { ApiResponse, MetaPagination } from "@/shared/types/common.type";
import type { Bid, JobAssignment } from "@/shared/types/entity.type";

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

export const getWorkerBids = async (page: number = 1, limit: number = 5, status?: string) => {
  const response = await privateApi.get("/users/me/bids", {
    params: {
      page,
      limit,
      status
    }
  });

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data penawaran");

  return (response.data) as ApiResponse<{ bid: Bid, job: JobAssignment }[]> & {
    meta: MetaPagination;
  };
}