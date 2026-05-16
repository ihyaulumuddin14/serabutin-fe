import type { Profile, User } from "@/shared/types/entity.type";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { ReviewCredentials } from "../schemas/reviewSchemas";
import { type EditProfileSchema } from "../schemas/userSchemas";
import { userKeys } from "../queries/userQueryKeys";
import {
  getMe,
  getMeReviews,
  getReviewsByUserId,
  getUserById,
  sendReview,
  updateProfile,
  updateProfileImage,
} from "../services/userServices";
import type { ReviewDraft } from "../stores/reviewStores";
import { showUserError, showUserSuccess } from "../utils/userUtils";

export const useMe = () => {
  const { data, isPending, isError, error, isLoading } = useQuery({
    queryKey: userKeys.me(),
    queryFn: getMe,
    retry: false,
    refetchOnWindowFocus: true,
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
    mutationFn: (payload: EditProfileSchema) => {
      return updateProfile(payload);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      showUserSuccess(data.message || "Profil berhasil diperbarui");
    },
    onError: (error) => {
      console.log(error);
      showUserError(error);
    },
  });
};

export const useUploadImageProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => updateProfileImage(file),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: userKeys.me() });
      showUserSuccess(data.message || "Gambar profil berhasil diperbarui");
    },
    onError: (error) => {
      showUserError(error);
    },
  });
};

export const useReviews = (
  userId: string,
  page: number = 1,
  limit: number = 10,
) => {
  return useQuery({
    queryKey: userKeys.reviews(userId, page, limit),
    queryFn: () => getReviewsByUserId(userId, page, limit),
  });
};

export const useMeReviews = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: userKeys.meReviews(page, limit),
    queryFn: () => getMeReviews(page, limit),
    placeholderData: keepPreviousData,
  });
};

export const useSubmitJobReviews = () => {
  return useMutation({
    mutationFn: async (params: { jobId: string; drafts: ReviewDraft[] }) => {
      const { jobId, drafts } = params;

      if (!drafts.length) return;

      await Promise.all(
        drafts.map((item) => sendReview(jobId, item as ReviewCredentials)),
      );
    },
    onSuccess: () => {
      showUserSuccess("Ulasan berhasil dikirim");
    },
    onError: (error) => {
      showUserError(error);
    },
  });
};

export const useUserById = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => getUserById(userId),
    staleTime: 5 * 60 * 1000,
  });
};
