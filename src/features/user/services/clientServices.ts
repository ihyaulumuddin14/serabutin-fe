import privateApi from "@/shared/api/axiosInstance";
import { toCamel } from "@/shared/lib/case";
import type { Job, User } from "@/shared/types/entity.type";

const mockWorker: Omit<User, "email" | "isVerified" | "isActive"> = {
  id: "01932b2a-7c3d-7e4f-8a5b-6c7d8e9f0a1b",
  fullName: "John Doe",
  role: "worker",
  createdAt: "2023-01-01T00:00:00Z",
  updatedAt: "2023-01-01T00:00:00Z",
}

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

  return toCamel(response.data) as {
    status: string,
    message: string,
    data: Job[],
    meta: {
      currentPage: number,
      perPage: number,
      total: number,
      lastPage: number
    }
  };
}

export const getWorkersByJobId = async (jobId: string) => {
  // const response = await privateApi.get(`/jobs/${jobId}/workers`);
  await new Promise((resolve) => setTimeout(resolve, 3000));

  // if (response.data.status !== "success")
  //   throw new Error(response.data?.message || "Gagal mengambil data pekerja");

  // return toCamel(response.data.data)
  return [mockWorker, mockWorker, mockWorker]
}