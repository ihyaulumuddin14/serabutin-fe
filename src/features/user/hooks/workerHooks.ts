import { useQuery } from "@tanstack/react-query";
import { getWorkerAssignments, getWorkerBids } from "../services/workerServices";
import type { BidStatus } from "../types";
import { useMe } from "./userHooks";

export const useMeAssignments = (
  page: number = 1,
  limit: number = 10,
  categorySlug?: string,
  status?: string,
) => {
  const { user } = useMe();

  return useQuery({
    queryKey: ["assignments", page, limit, categorySlug, status],
    queryFn: () => getWorkerAssignments(page, limit, categorySlug, status),
    enabled: user?.role === "worker"
  })
}

export const useMeBids = ({
  page = 1,
  limit = 10,
  status,
  enabled = true,
}: {
  page?: number;
  limit?: number;
  status?: BidStatus;
  enabled?: boolean;
}) => {
  const { user } = useMe();

  return useQuery({
    queryKey: ["bids", page, limit, status],
    queryFn: () => getWorkerBids(page, limit, status),
    enabled: user?.role === "worker" && enabled,
   })
}