import { useQuery } from "@tanstack/react-query";
import { getClientJobs, getWorkersByJobId } from "../services/clientServices";
import { useMe } from "./userHooks";

export const useMeJobs = (page: number = 1, limit: number = 10, categorySlug?: string, status?: string) => {
  const { user } = useMe();

  return useQuery({
    queryKey: ["jobs"],
    queryFn: () => getClientJobs(page, limit, categorySlug, status),
    enabled: user?.role === "client"
  })
}

export const useGetWorkers = (jobId: string) => {
  const { user } = useMe();

  return useQuery({
    queryKey: ["workers", jobId],
    queryFn: () => getWorkersByJobId(jobId),
    enabled: !!jobId && user?.role === "client",
    retry: false
  })
}