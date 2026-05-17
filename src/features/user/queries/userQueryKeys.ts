export type PaginationParams = {
  page?: number;
  limit?: number;
};

export type JobListParams = PaginationParams & {
  categorySlug?: string;
  status?: string;
};

export type ClientBidsParams = PaginationParams & {
  jobId: string;
  status?: string;
};

export type WorkerBidsParams = PaginationParams & {
  status?: string;
};

export const userKeys = {
  all: ["user"] as const,
  me: () => [...userKeys.all, "me"] as const,
  detail: (userId: string) => [...userKeys.all, "detail", userId] as const,
  jobs: (userId: string, params: JobListParams) =>
    [...userKeys.all, "jobs", userId, params] as const,
  assignments: (userId: string, params: JobListParams) =>
    [...userKeys.all, "assignments", userId, params] as const,
  reviews: (userId: string, page: number, limit: number) =>
    [...userKeys.all, "reviews", userId, page, limit] as const,
  meReviews: (page: number, limit: number) =>
    [...userKeys.all, "me-reviews", page, limit] as const,
};

export const clientKeys = {
  all: ["client"] as const,
  meJobs: (params: JobListParams) =>
    [...clientKeys.all, "jobs", params] as const,
  workers: (jobId: string) => [...clientKeys.all, "workers", jobId] as const,
  bids: (params: ClientBidsParams) =>
    [...clientKeys.all, "bids", params] as const,
};

export const workerKeys = {
  all: ["worker"] as const,
  assignments: (params: JobListParams) =>
    [...workerKeys.all, "assignments", params] as const,
  bids: (params: WorkerBidsParams) =>
    [...workerKeys.all, "bids", params] as const,
};
