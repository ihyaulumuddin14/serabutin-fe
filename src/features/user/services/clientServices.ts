import privateApi from "@/shared/api/axiosInstance";
import { toCamel } from "@/shared/lib/case";
import type { ApiResponse, MetaPagination } from "@/shared/types/common.type";
import type { Bid, JobAssignment } from "@/shared/types/entity.type";
import type { WorkerToReview } from "../types";
import { ensureSuccess } from "./userServiceUtils";

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
      status,
    },
  });

  const data = ensureSuccess(response, "Gagal mengambil data pekerjaan");
  return toCamel(data) as ApiResponse<JobAssignment[]> & {
    meta: {
      currentPage: number;
      perPage: number;
      total: number;
      lastPage: number;
    };
  };
};

export const getWorkersByJobId = async (jobId: string) => {
  const response = await privateApi.get(`/jobs/${jobId}/workers`);
  const data = ensureSuccess(response, "Gagal mengambil data pekerja");
  return toCamel(data.data) as WorkerToReview[];
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
      limit,
    },
  });

  const data = ensureSuccess(response, "Gagal mengambil data penawaran");
  return toCamel(data) as ApiResponse<Bid[]> & { meta: MetaPagination };
};

export const acceptBid = async (bidId: string) => {
  const response = await privateApi.patch(`/bids/${bidId}/accept`);

  const data = ensureSuccess(response, "Gagal menerima penawaran");
  return toCamel(data) as ApiResponse<Bid>;
};
