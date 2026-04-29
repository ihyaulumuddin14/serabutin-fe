import privateApi from "@/shared/api/axiosInstance";
import { toCamel } from "@/shared/lib/case";
import type { Profile, User } from "@/shared/types/entity.type";

export async function getMe() {
  const response = await privateApi.get(`/users/me`);

  if (response.data.status !== "success")
    throw new Error(response.data?.message || "Gagal mengambil data pengguna");

  return toCamel(response.data.data as { user: User; profile: Profile });
}
