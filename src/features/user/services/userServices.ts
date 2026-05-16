import { privateApi } from "@/shared/api/axiosInstance";
import { toCamel, toSnake } from "@/shared/lib/case";
import type { ApiResponse, MetaPagination } from "@/shared/types/common.type";
import type { Profile, Review, User } from "@/shared/types/entity.type";
import type { ReviewCredentials } from "../schemas/reviewSchemas";
import { type EditProfileSchema } from "../schemas/userSchemas";
import type { WorkerProfile } from "../types";

export async function getMe() {
  const response = await privateApi.get(`/users/me`);

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data pengguna");

  return toCamel(response.data.data) as { user: User; profile: Profile };
}

export const updateProfile = async (payload: EditProfileSchema) => {
  const convertedPayload = toSnake(payload);

  const response = await privateApi.patch("/users/me", convertedPayload);

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengubah data pengguna");

  return toCamel(response.data) as ApiResponse;
};

export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const uploadResponse = await privateApi.post("/uploads", formData);

  if (uploadResponse.data.status !== "success")
    throw new Error(
      uploadResponse.data?.message || "Gagal mengunggah gambar profil",
    );

  const updateResponse = await privateApi.patch("/users/me", {
    avatar_url: uploadResponse.data.data.url,
  });

  if (updateResponse.data.status !== "success")
    throw new Error(
      updateResponse.data?.message || "Gagal memperbarui gambar profil",
    );

  return toCamel(updateResponse.data) as ApiResponse;
};

export const getMeReviews = async (page: number, limit: number) => {
  const response = await privateApi.get("/users/me/reviews", {
    params: {
      page,
      limit,
    },
  });

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data ulasan");

  return toCamel(response.data) as ApiResponse<Review[]> & {
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

export const sendReview = async (jobId: string, payload: ReviewCredentials) => {
  const response = await privateApi.post(
    `/jobs/${jobId}/reviews`,
    toSnake(payload),
  );

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengirim ulasan");

  return toCamel(response.data) as ApiResponse;
};


export const getUserById = async (userId: string) => {
  const response = await privateApi.get(`/users/${userId}`);

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data pengguna");

  return toCamel(response.data.data) as { user: User; profile: Profile | WorkerProfile }  ;
};