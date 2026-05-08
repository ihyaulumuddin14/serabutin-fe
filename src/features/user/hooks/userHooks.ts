import type { Profile, User } from "@/shared/types/entity.type";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { type EditProfileSchema } from "../schemas/userSchemas";
import {
  getMe,
  getMeReviews,
  getReviewsByUserId,
  sendReview,
  updateProfile,
  updateProfileImage,
} from "../services/userServices";
import type { ReviewCredentials } from "../schemas/reviewSchemas";
import type { ReviewDraft } from "../stores/reviewStores";

export const useMe = () => {
  const { data, isPending, isError, error, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    refetchOnWindowFocus: true
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

export const useReviews = (userId: string, page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["reviews", userId, page],
    queryFn: () => getReviewsByUserId(userId, page, limit),
  });
};

export const useMeReviews = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ["me-reviews", page, limit],
    queryFn: () => getMeReviews(page, limit),
    placeholderData: keepPreviousData,
  })
}

export const useSubmitJobReviews = () => {
  return useMutation({
    mutationFn: async (params: {
        jobId: string;
        drafts: ReviewDraft[];
      }) => {
        const { jobId, drafts } = params;

        if (!drafts.length) return;

        await Promise.all(
          drafts.map((item) =>
            sendReview(jobId, item as ReviewCredentials)
          )
        );
      }
    ,
    onSuccess: () => {
      toast.success("Ulasan berhasil dikirim");
    },
    onError: (error) => {
      toast.error(
        error instanceof AxiosError
          ? error.response?.data?.message || "Terjadi kesalahan sistem"
          : (error as Error).message,
      );
    },
  });
};