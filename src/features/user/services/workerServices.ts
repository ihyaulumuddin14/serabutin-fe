import privateApi from "@/shared/api/axiosInstance";
import { toCamel, toSnake } from "@/shared/lib/case";
import type { ApiResponse, MetaPagination } from "@/shared/types/common.type";
import type {
  Bid,
  JobAssignment,
  Profile,
  User,
  WorkerAssignment,
} from "@/shared/types/entity.type";
import { ensureSuccess } from "./userServiceUtils";
import type { BidCredentials } from "../schemas/bidSchemas";

export const getWorkerAssignments = async (
  page: number = 1,
  limit: number = 10,
  categorySlug?: string,
  status?: string,
) => {
  const response = await privateApi.get("/users/me/assignments", {
    params: {
      page,
      limit,
      categorySlug,
      status,
    },
  });

  const data = ensureSuccess(response, "Gagal mengambil data pekerjaan");
  return toCamel(data) as ApiResponse<WorkerAssignment[]> & {
    meta: {
      currentPage: number;
      perPage: number;
      total: number;
      lastPage: number;
    };
  };
};

export const getWorkerBids = async (
  page: number = 1,
  limit: number = 5,
  status?: string,
) => {
  const response = await privateApi.get("/users/me/bids", {
    params: {
      page,
      limit,
      status,
    },
  });

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data penawaran");

  return response.data as ApiResponse<
    {
      bid: Bid;
      job: JobAssignment;
      client: Omit<User, "email" | "isVerified" | "isActive"> &
        Partial<Pick<Profile, "phone">>;
    }[]
  > & {
    meta: MetaPagination;
  };
};

export const createBid = async (jobId: string, payload: BidCredentials) => {
  const convertedPayload = toSnake(payload);

  const response = await privateApi.post(
    `/jobs/${jobId}/bids`,
    convertedPayload,
  );

  const data = ensureSuccess(response, "Gagal mengirim penawaran");
  return toCamel(data) as ApiResponse<Bid>;
};

export const cancelBid = async (bidId: string) => {
  const response = await privateApi.delete(`/bids/${bidId}`);

  const data = ensureSuccess(response, "Gagal membatalkan penawaran");
  return toCamel(data) as ApiResponse<Bid>;
};
