import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, updateProfileImage } from "../services/userServices";
import type { Profile, User } from "@/shared/types/entity.type";
import { type EditProfileSchema } from "../schemas/userSchemas";
import { updateProfile } from "../services/userServices";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const useMe = () => {
  const { data, isPending, isError, error, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  return {
    user: data?.user as User | null,
    profile: data?.profile as Profile | null,
    isPending,
    isError,
    error,
    isLoading,
  };
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EditProfileSchema) => updateProfile(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(data.message || "Profil berhasil diperbarui");
    },
    onError: (error) => {
      console.log(error)
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.message || "Terjadi kesalahan sistem"
          : (error as Error).message,
      );
    },
  });
};

export const useUploadImageProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn:  (file: File) => updateProfileImage(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success(data.message || "Gambar profil berhasil diperbarui");
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.message || "Terjadi kesalahan sistem"
          : (error as Error).message,
      );
    },
  })
}