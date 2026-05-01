import { toCamel, toSnake } from "@/shared/lib/case";
import type { Profile, User } from "@/shared/types/entity.type";
import { privateApi } from "@/shared/api/axiosInstance";
import { type EditProfileSchema } from "../schemas/userSchemas";

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

  return toCamel(response.data);
};

export const updateProfileImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const uploadResponse = await privateApi.post("/uploads", formData);

  if (uploadResponse.data.status !== "success")
    throw new Error(uploadResponse.data?.message || "Gagal mengunggah gambar profil");

  const updateResponse = await privateApi.patch("/users/me", {
    avatar_url: uploadResponse.data.data.url,
  });

  if (updateResponse.data.status !== "success")
    throw new Error(updateResponse.data?.message || "Gagal memperbarui gambar profil");


  return toCamel(updateResponse.data);
}