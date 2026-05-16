import { toCamel } from "@/shared/lib/case";
import type { ApiResponse } from "@/shared/types/common.type";
import type { JobAssignment } from "@/shared/types/entity.type";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useCallback, useRef } from "react";
import type { JobsInfiniteResponse } from "../services/jobServices";
import { PostedJobItem } from "./PostedJobItem";
import PostedJobItemSkeleton from "./skeleton/PostedJobItemSkeleton";

const ListPostedJobs = ({
  categorySlug,
  city,
  budgetMin,
  budgetMax,
  dateFrom,
  dateTo,
  q,
}: {
  categorySlug?: string;
  city?: string;
  budgetMin?: number;
  budgetMax?: number;
  dateFrom?: string;
  dateTo?: string;
  q?: string;
}) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
    error,
  } = useInfiniteQuery<
    JobsInfiniteResponse, // 1. TQueryFnData
    AxiosError<ApiResponse>, // 2. TError (Tipe error)
    InfiniteData<JobsInfiniteResponse, string | null>, // 3. TData (Bentuk akhir data.pages, wajib menyertakan tipe pageParam)
    unknown[], // 4. TQueryKey
    string | null // 5. TPageParam
  >({
    queryKey: [
      "jobs",
      categorySlug,
      city,
      budgetMin,
      budgetMax,
      dateFrom,
      dateTo,
      q,
    ],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/jobs`, {
        params: {
          cursor: pageParam,
          limit: 10,
          category_slug: categorySlug,
          city,
          budget_min: budgetMin,
          budget_max: budgetMax,
          date_from: dateFrom,
          date_to: dateTo,
          q,
        },
      });

      if (response.data.status !== "success")
        throw new Error(
          response.data?.message || "Gagal mengambil data pekerjaan",
        );

      return toCamel(response.data) as JobsInfiniteResponse;
    },

    initialPageParam: null,

    getNextPageParam: (lastPage) => {
      if (lastPage.meta?.hasMore && lastPage.meta?.nextCursor) {
        return lastPage.meta.nextCursor;
      }
      return undefined;
    },
  });

  const jobs: JobAssignment[] = data?.pages?.flatMap((page) => page.data) ?? [];

  const errorMessage = isError
    ? (error?.response?.data?.message ?? "Terjadi kesalahan sistem")
    : "";

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: Element | null) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) observerRef.current.disconnect();

      if (node) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0]?.isIntersecting && hasNextPage) {
              void fetchNextPage();
            }
          },
          { rootMargin: "200px 0px", threshold: 0 },
        );
        observerRef.current.observe(node);
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  return (
    <ol className="w-full h-fit flex flex-col gap-4 pb-4">
      {errorMessage ? (
        <li className="w-full p-6 bg-card rounded-lg text-sm text-destructive">
          {errorMessage}
        </li>
      ) : jobs.length === 0 && !isPending ? (
        <li className="w-full p-6 rounded-lg text-sm text-muted-foreground">
          Belum ada kebutuhan jasa yang tersedia.
        </li>
      ) : (
        jobs.map((job) => (
          <PostedJobItem
            ref={loadMoreRef}
            key={job.id}
            job={job}
          />
        ))
      )}

      {isPending || (isFetchingNextPage && hasNextPage) ? (
        [...Array(3)].map((_, index) => <PostedJobItemSkeleton key={index} />)
      ) : <p className="w-full p-6 rounded-lg text-sm text-center text-muted-foreground">Kamu sudah mencapai akhir.</p>}
    </ol>
  );
};

export default ListPostedJobs;
