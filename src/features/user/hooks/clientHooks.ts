import { useQuery } from "@tanstack/react-query";
import { getBidsOfJob, getClientJobs, getWorkersByJobId } from "../services/clientServices";
import type { BidStatus, WorkerToReview } from "../types";
import { useMe } from "./userHooks";

export const useMeJobs = ({
  page = 1,
  limit = 10,
  categorySlug,
  status
}: {
  page?: number;
  limit?: number;
  categorySlug?: string;
  status?: string;
}) => {
  const { user } = useMe();

  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => getClientJobs(page, limit, categorySlug, status),
    enabled: user?.role === "client"
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
    data: data?.data as WorkerToReview[],
    isLoading,
    isError,
    error
  }
}

export const useGetBidsOfJob = (jobId: string, status?: BidStatus, page?: number, limit?: number) => {
  const { user } = useMe();
  const isClient = user?.role === "client";

  return useQuery({
    queryKey: ["bids", jobId],
    queryFn: () => getBidsOfJob(page, jobId, status, limit),
    enabled: !!jobId && isClient
  })
}