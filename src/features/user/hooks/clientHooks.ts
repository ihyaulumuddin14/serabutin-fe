import { useQuery } from "@tanstack/react-query";
import { getClientJobs, getWorkerAssignments, getWorkersByJobId } from "../services/clientServices";
import { useMe } from "./userHooks";
import type { WorkerToReview } from "../types";

export const useMeJobs = (page: number = 1, limit: number = 10, categorySlug?: string, status?: string) => {
  const { user } = useMe();

  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => getClientJobs(page, limit, categorySlug, status),
    enabled: user?.role === "client"
  })
}

export const useMeAssignments = (page: number = 1, limit: number = 10, categorySlug?: string, status?: string) => {
  const { user } = useMe();

  return useQuery({
    queryKey: ["assignments"],
    queryFn: () => getWorkerAssignments(page, limit, categorySlug, status),
    enabled: user?.role === "worker"
  })
}

export const useGetWorkers = (jobId: string, enabled: boolean = true) => {
  const { user } = useMe();
  const isClient = user?.role === "client";
  
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["workers", jobId],
    queryFn: () => getWorkersByJobId(jobId),
    enabled: enabled && !!jobId && isClient,
    retry: false
  })

  return {
    toBeReviewedData: data?.data as WorkerToReview[],
    isLoading,
    isError,
    error
  }
}