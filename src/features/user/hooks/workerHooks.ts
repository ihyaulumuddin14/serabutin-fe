import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  cancelBid,
  createBid,
  getWorkerAssignments,
  getWorkerBids,
} from "../services/workerServices";
import type { BidStatus } from "../types";
import { useMe } from "./userHooks";
import { clientKeys, workerKeys } from "../queries/userQueryKeys";
import type { BidCredentials } from "../schemas/bidSchemas";
import { showJobError, showJobSuccess } from "@/features/jobs/utils/jobUtils";

export const useMeAssignments = (
  page: number = 1,
  limit: number = 10,
  categorySlug?: string,
  status?: string,
) => {
  const { user } = useMe();
  const params = { page, limit, categorySlug, status };

  return useQuery({
    queryKey: workerKeys.assignments(params),
    queryFn: () => getWorkerAssignments(page, limit, categorySlug, status),
    enabled: user?.role === "worker",
  });
};

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
  const params = { page, limit, status };

  return useQuery({
    queryKey: workerKeys.bids(params),
    queryFn: () => getWorkerBids(page, limit, status),
    enabled: user?.role === "worker" && enabled,
  });
};

export const useCreateBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string;
      payload: BidCredentials;
    }) => createBid(jobId, payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workerKeys.bids({}) });
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      showJobSuccess(data.message || "Penawaran berhasil dikirim");
    },
    onError: (error) => {
      showJobError(error);
    },
  });
};

export const useCancelBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bidId: string) => cancelBid(bidId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: workerKeys.bids({}) });
      queryClient.invalidateQueries({ queryKey: clientKeys.all });
      showJobSuccess(data.message || "Penawaran berhasil dibatalkan");
    },
    onError: (error) => {
      showJobError(error);
    },
  });
};
