export type JobStatus = "open" | "in_progress" | "completed" | "cancelled";

export type ApiResponse<T = unknown> = {
  status: string,
  message: string,
  data?: T
}

export type MetaPagination = {
  currentPage: number;
  perPage: number;
  total: number;
  lastPage: number;
}

export type MetaCursorPagination = {
  nextCursor: string | null;
  perPage: number;
  hasMore: boolean;
}