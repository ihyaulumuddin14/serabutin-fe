import { privateApi } from "@/shared/api/axiosInstance";
import { toCamel, toSnake } from "@/shared/lib/case";
import type { ApiResponse, MetaPagination } from "@/shared/types/common.type";
import type {
  JobAssignment,
  Profile,
  Review,
  User,
  WorkerAssignment,
} from "@/shared/types/entity.type";
import type { ReviewCredentials } from "../schemas/reviewSchemas";
import { type EditProfileSchema } from "../schemas/userSchemas";
import type { WorkerProfile } from "../types";
import { ensureSuccess } from "./userServiceUtils";

export async function getMe() {
  const response = await privateApi.get(`/users/me`);

  const data = ensureSuccess(response, "Gagal mengambil data pengguna");
  return toCamel(data.data) as { user: User; profile: Profile };
}

export const updateProfile = async (payload: EditProfileSchema) => {
  const convertedPayload = toSnake(payload);

  const response = await privateApi.patch("/users/me", convertedPayload);

  const data = ensureSuccess(response, "Gagal mengubah data pengguna");
  return toCamel(data) as ApiResponse;
};

export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const uploadResponse = await privateApi.post("/uploads", formData);

  const uploadData = ensureSuccess(
    uploadResponse,
    "Gagal mengunggah gambar profil",
  );

  const updateResponse = await privateApi.patch("/users/me", {
    avatar_url: uploadData.data.url,
  });

  const updateData = ensureSuccess(
    updateResponse,
    "Gagal memperbarui gambar profil",
  );

  return toCamel(updateData) as ApiResponse;
};

export const getMeReviews = async (page: number, limit: number) => {
  const response = await privateApi.get("/users/me/reviews", {
    params: {
      page,
      limit,
    },
  });

  const data = ensureSuccess(response, "Gagal mengambil data ulasan");
  return toCamel(data) as ApiResponse<Review[]> & {
    meta: MetaPagination;
  };
};

export const getUserReviews = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const response = await privateApi.get(`/users/${userId}/reviews`, {
    params: {
      page,
      limit,
    },
  });

  const data = ensureSuccess(response, "Gagal mengambil data ulasan");
  return toCamel(data) as ApiResponse<Review[]> & {
    meta: MetaPagination;
  };
};

export const getUserJobs = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  categorySlug?: string,
  status?: string,
) => {
  const response = await privateApi.get(`/users/${userId}/jobs`, {
    params: {
      page,
      limit,
      categorySlug,
      status,
    },
  });

  const data = ensureSuccess(response, "Gagal mengambil data pekerjaan");
  return toCamel(data) as ApiResponse<JobAssignment[]> & {
    meta: MetaPagination;
  };
};

export const getUserAssignments = async (
  userId: string,
  page: number = 1,
  limit: number = 10,
  categorySlug?: string,
  status?: string,
) => {
  const response = await privateApi.get(`/users/${userId}/assignments`, {
    params: {
      page,
      limit,
      categorySlug,
      status,
    },
  });

  const data = ensureSuccess(response, "Gagal mengambil data pekerjaan");

  console.log(data);
  return toCamel(data) as ApiResponse<WorkerAssignment[]> & {
    meta: MetaPagination;
  };
};

export const getReviewsByUserId = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const response = await privateApi.get(
    `/users/${userId}/reviews?page=${page}&limit=${limit}`,
  );
  return toCamel(response.data) as ApiResponse<Review[]> & {
    meta: MetaPagination;
  };
};

export const sendReview = async (
  jobId: string,
  payload: ReviewCredentials,
) => {
  const response = await privateApi.post(
    `/jobs/${jobId}/reviews`,
    toSnake(payload),
  );

  const data = ensureSuccess(response, "Gagal mengirim ulasan");
  return toCamel(data) as ApiResponse;
};

export const getUserById = async (userId: string) => {
  const response = await privateApi.get(`/users/${userId}`);

  const data = ensureSuccess(response, "Gagal mengambil data pengguna");
  return toCamel(data.data) as { user: User; profile: Profile | WorkerProfile };
};
