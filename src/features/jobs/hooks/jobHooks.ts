import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobKeys, type JobListFilters } from "../queries/jobQueryKeys";
import {
  getCategories,
  getJobById,
  getJobs,
  postJob,
} from "../services/jobServices";
import type { PostJobCredentials } from "../schemas/postJobSchemas";
import { showJobError, showJobSuccess } from "../utils/jobUtils";

export const useCategory = () => {
  return useQuery({
    queryKey: jobKeys.categories(),
    queryFn: getCategories,
  });
};

export const useGetJobs = ({
  cursor,
  limit = 10,
  categorySlug,
  city,
  budgetMin,
  budgetMax,
  dateFrom,
  dateTo,
  q,
}: JobListFilters) => {
  const filters: JobListFilters = {
    cursor,
    limit,
    categorySlug,
    city,
    budgetMin,
    budgetMax,
    dateFrom,
    dateTo,
    q,
  };

  return useQuery({
    queryKey: jobKeys.listCursor(filters),
    queryFn: () =>
      getJobs({
        ...filters,
      }),
    retry: false,
  });
};

export const useGetJobById = (
  jobId: string = "fe463126-5d81-44b8-a798-56032046fbd2",
) => {
  return useQuery({
    queryKey: jobKeys.detail(jobId),
    queryFn: () => getJobById(jobId),
    retry: false,
  });
};

export const usePostJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: PostJobCredentials) => postJob(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      showJobSuccess(data.message || "Kebutuhan jasa berhasil diposting");
    },
    onError: (error) => {
      showJobError(error);
    },
  });
};
