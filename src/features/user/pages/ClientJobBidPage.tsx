import { JobBidItem } from "@/features/jobs/components/JobOffer";
import { useMeJobs } from "../hooks/clientHooks";
import JobOfferSkeleton from "@/features/jobs/components/skeleton/JobOfferSkeleton";
import { PaginationWithLinks } from "@/shared/components/ui/pagination-with-links";
import { useState } from "react";

const ClientJobBidPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading, isError, error } = useMeJobs({
    page,
    limit,
    status: "open",
  });
  const jobBids = data?.data ?? [];
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Terjadi kesalahan saat memuat pekerjaan.";

  return (
    <div className="w-full h-fit flex flex-col gap-4 sm:gap-6">
      <h2 className="font-bold text-xl">Daftar Pekerjaan</h2>

      <ol className="w-full flex flex-col gap-3 mt-3 border">
        {isLoading ? (
          [...Array(2)].map((_, i) => <JobOfferSkeleton key={i} />)
        ) : isError ? (
          <p className="text-center text-sm text-destructive">{errorMessage}</p>
        ) : jobBids.length > 0 ? (
          jobBids.map((job) => (
            <JobBidItem
              className="bg-card"
              key={job.id}
              job={job}
            />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Tidak ada pekerjaan yang sedang dibuka.
          </p>
        )}
      </ol>

      {!!data?.meta?.total && (
        <PaginationWithLinks
          page={page}
          pageSize={limit}
          totalCount={data?.meta?.total || 0}
          onPageChange={setPage}
          onPageSizeChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      )}
    </div>
  );
};

export default ClientJobBidPage;
