export type Status = "open" | "in_progress" | "completed";

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