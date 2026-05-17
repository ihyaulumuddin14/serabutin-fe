import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { jobKeys, type JobListFilters } from "../queries/jobQueryKeys";
import {
  deleteJob,
  editJob,
  getCategories,
  getJobById,
  getJobs,
  postJob,
  updateJobStatus,
} from "../services/jobServices";
import type {
  EditJobCredentials,
  PostJobCredentials,
} from "../schemas/postJobSchemas";
import { showJobError, showJobSuccess } from "../utils/jobUtils";
import { clientKeys, userKeys } from "@/features/user/queries/userQueryKeys";
import type { JobStatus } from "@/shared/types/common.type";

export const useCategory = () => {
  return useQuery({
    queryKey: jobKeys.categories(),
    queryFn: getCategories,
  });
};

export const useGetJobs = ({ cursor, limit = 10, ...rest }: JobListFilters) => {
  const filters = { limit, ...rest };

  return useQuery({
    queryKey: jobKeys.list(filters),
    queryFn: () => getJobs({ cursor, ...filters }),
    retry: false,
  });
};

export const useGetJobById = (jobId: string) => {
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

export const useEditJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string;
      payload: EditJobCredentials;
    }) => editJob(jobId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.meJobs({}) });
      showJobSuccess(data.message || "Kebutuhan jasa berhasil diperbarui");
    },
    onError: (error) => {
      showJobError(error);
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: jobKeys.all });
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      showJobSuccess(data.message || "Kebutuhan jasa berhasil dihapus");
    },
    onError: (error) => {
      showJobError(error);
    },
  });
};

export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ jobId, status }: { jobId: string; status: JobStatus }) =>
      updateJobStatus(jobId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      showJobSuccess(data.message || "Status pekerjaan berhasil diperbarui");
    },
    onError: (error) => {
      showJobError(error);
    },
  });
};
