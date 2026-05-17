import JobOfferSkeleton from "@/features/jobs/components/skeleton/JobOfferSkeleton";
import { useGetJobById } from "@/features/jobs/hooks/jobHooks";
import { Button } from "@/shared/components/ui/button";
import { PaginationWithLinks } from "@/shared/components/ui/pagination-with-links";
import type { Bid, Category } from "@/shared/types/entity.type";
import { Icon } from "@iconify-icon/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useGetBidsOfJob, useGetWorkers } from "../hooks/clientHooks";
import { useUserById } from "../hooks/userHooks";
import type { BidStatus, CategoryRating } from "../types";
import { cn } from "@/shared/lib/utils";
import { DialogBidAccept } from "../components/DialogBidAccept";

const ClientBidPage = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState<BidSortOption>("newest");
  const [statusFilter, setStatusFilter] = useState<BidStatus | undefined>(
    undefined,
  );
  const pathname = useLocation().pathname;
  const jobId = pathname.split("/").slice(-1)[0];
  const {
    data: jobData,
    isPending: jobDataPending,
    isError: jobDataError,
    error: jobError,
  } = useGetJobById(jobId);
  const {
    data: workersData,
    isLoading: workersLoading,
    isError: workersError,
    error: workersErrorData,
  } = useGetWorkers(jobData?.id || "", !!jobData);
  const {
    data: bidsData,
    isLoading: bidsDataLoading,
    isError: bidsError,
    error: bidsErrorData,
  } = useGetBidsOfJob(jobData?.id || "", statusFilter, page, limit);
  const sortedBids = useMemo(() => {
    const bids = bidsData?.data ? [...bidsData.data] : [];

    return bids.sort((first, second) => {
      if (sort === "price-high") {
        return second.proposedPrice - first.proposedPrice;
      }

      if (sort === "price-low") {
        return first.proposedPrice - second.proposedPrice;
      }

      const firstTime = new Date(first.createdAt).getTime();
      const secondTime = new Date(second.createdAt).getTime();

      return sort === "oldest"
        ? firstTime - secondTime
        : secondTime - firstTime;
    });
  }, [bidsData, sort]);

  if (jobDataPending) {
    return (
      <section className="w-full min-h-screen bg-background flex justify-center items-center">
        <Icon
          icon="eos-icons:loading"
          width="2em"
          height="2em"
          className="animate-spin"
          style={{ color: "var(--foreground)" }}
        />
      </section>
    );
  }

  if (jobDataError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Icon
          icon="ic:baseline-error-outline"
          width="3em"
          height="3em"
          style={{ color: "#F97316" }}
        />
        <p className="text-muted-foreground text-sm">
          {jobError instanceof Error
            ? jobError.message
            : "Terjadi kesalahan saat memuat pekerjaan."}
        </p>
      </div>
    );
  }

  if (!jobData && !jobDataPending) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <Icon
          icon="ic:baseline-error-outline"
          width="3em"
          height="3em"
          style={{ color: "#F97316" }}
        />
        <p className="text-muted-foreground text-sm">
          Pekerjaan tidak ditemukan.
        </p>
      </div>
    );
  }
  return (
    <div className="w-full h-fit flex flex-col gap-4 sm:gap-6">
      <h2 className="font-bold text-xl">Daftar Penawaran</h2>

      <header className="w-full flex flex-col md:flex-row gap-3 justify-between">
        <div className="w-fit flex-col gap-1">
          <h3 className="font-semibold text-lg">{jobData?.title}</h3>
          <p className="w-fit font-semibold text-sm text-muted-foreground flex items-center gap-2 bg-muted py-1 px-2 rounded-md">
            <Icon
              icon="ic:baseline-group"
              width="1em"
              height="1em"
              style={{ color: "#F97316" }}
            />
            {workersLoading ? (
              "Memuat jumlah pekerja..."
            ) : (
              <>
                Diterima {workersData?.length || 0} dari{" "}
                {jobData?.workersNeeded || 0} total yang dibutuhkan
              </>
            )}
          </p>
          {workersError && (
            <p className="text-xs text-destructive">
              {workersErrorData instanceof Error
                ? workersErrorData.message
                : "Gagal memuat pekerja."}
            </p>
          )}
        </div>

        <div className="w-full md:w-fit flex justify-end items-center gap-4 md:gap-6">
          <BidSortFilter
            value={sort}
            onChange={setSort}
          />
          <BidStatusFilter
            value={statusFilter}
            onChange={(nextValue) => {
              setStatusFilter(nextValue);
              setPage(1);
            }}
          />
        </div>
      </header>

      <ol className="w-full flex flex-col gap-3 mt-3 border">
        {bidsDataLoading ? (
          [...Array(2)].map((_, i) => <JobOfferSkeleton key={i} />)
        ) : bidsError ? (
          <p className="text-center text-sm text-destructive">
            {bidsErrorData instanceof Error
              ? bidsErrorData.message
              : "Terjadi kesalahan saat memuat penawaran."}
          </p>
        ) : sortedBids.length ? (
          sortedBids.map((bid) => (
            <ClientBidItem
              key={bid.id}
              bid={bid}
              category={jobData.category}
              jobTitle={jobData.title}
            />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Tidak ada pekerjaan yang sedang dibuka.
          </p>
        )}
      </ol>

      {!!bidsData?.meta?.total && (
        <PaginationWithLinks
          page={page}
          pageSize={limit}
          totalCount={bidsData?.meta?.total || 0}
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

export default ClientBidPage;

type BidSortOption = "newest" | "oldest" | "price-high" | "price-low";

const BidSortFilter = ({
  value,
  onChange,
}: {
  value: BidSortOption;
  onChange: (value: BidSortOption) => void;
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Urutkan</span>
      <Select
        value={value}
        onValueChange={(nextValue) => onChange(nextValue as BidSortOption)}
      >
        <SelectTrigger
          size="sm"
          className="bg-card"
        >
          <SelectValue placeholder="Urutkan" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Terbaru</SelectItem>
          <SelectItem value="oldest">Terlama</SelectItem>
          <SelectItem value="price-high">Harga tertinggi</SelectItem>
          <SelectItem value="price-low">Harga terendah</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const BidStatusFilter = ({
  value,
  onChange,
}: {
  value: BidStatus | undefined;
  onChange: (value: BidStatus | undefined) => void;
}) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-muted-foreground">Status</span>
      <Select
        value={value ?? "all"}
        onValueChange={(nextValue) =>
          onChange(nextValue === "all" ? undefined : (nextValue as BidStatus))
        }
      >
        <SelectTrigger
          size="sm"
          className="bg-card"
        >
          <SelectValue placeholder="Semua status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua</SelectItem>
          <SelectItem value="pending">Menunggu</SelectItem>
          <SelectItem value="accepted">Diterima</SelectItem>
          <SelectItem value="rejected">Ditolak</SelectItem>
          <SelectItem value="withdrawn">Dibatalkan</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

const ClientBidItem = ({
  bid,
  category,
  jobTitle,
}: {
  bid: Bid;
  category: Category;
  jobTitle: string;
}) => {
  const navigate = useNavigate();
  const [isDialogBidAcceptOpen, setIsDialogBidAcceptOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflow, setIsOverflow] = useState(false);
  const messageRef = useRef<HTMLParagraphElement | null>(null);
  const initials = bid?.worker?.fullName
    ? bid.worker.fullName
        .split(" ")
        .map((n, i) => (i < 2 ? n[0] : ""))
        .join("")
    : "";
  const avatarContent = (
    <div className="w-12 h-12 rounded-full border-2 border-ring flex justify-center items-center bg-accent">
      <span className="font-bold text-accent-foreground text-sm">
        {initials}
      </span>
    </div>
  );

  const { data } = useUserById("019e2fb6-7cb7-70c8-b0fb-b37310552261");
  const profile = data?.profile;

  const workerCategoryRating: CategoryRating | undefined =
    profile && "categoryRatings" in profile
      ? profile?.categoryRatings.find(
          (c: CategoryRating) => c.categoryId === category?.id,
        )
      : undefined;
  const categoryAvgRating = workerCategoryRating
    ? workerCategoryRating.avgRating
    : 0;
  const workerAvgRating =
    profile && "avgRating" in profile ? profile?.avgRating : 0;

  const message = bid.message?.trim();

  useEffect(() => {
    if (isExpanded) return;
    const element = messageRef.current;
    if (!element) return;

    setIsOverflow(element.scrollHeight > element.clientHeight);
  }, [message, isExpanded]);

  const handleVisitProfile = () => {
    const clientId = bid?.worker?.id;
    if (clientId) {
      navigate(`/profile/${clientId}`);
    }
  };

  return (
    <li
      className={cn(
        "w-full p-3 sm:p-4 rounded-lg border border-border bg-card flex flex-col items-start sm:flex-row justify-between sm:items-center gap-5",
        bid.status === "accepted" ||
          bid.status === "rejected" ||
          bid.status === "withdrawn"
          ? "opacity-50 pointer-events-none"
          : "",
      )}
    >
      <div className="flex flex-col gap-2 sm:gap-5 items-start">
        <div className="flex gap-2 sm:gap-5 items-center">
          {avatarContent}
          <div className="flex flex-col">
            <p className="font-semibold">{bid?.worker?.fullName}</p>
            <p className="text-xs sm:text-sm text-muted-foreground flex gap-1 items-center">
              {category.name}:{" "}
              {[...Array(5)].map((_, i) => {
                return (
                  <Icon
                    key={i}
                    icon="radix-icons:star-filled"
                    width=".8em"
                    height=".8em"
                    style={{
                      color: i + 1 > categoryAvgRating ? "#9A8F85" : "#F97316",
                    }}
                  />
                );
              })}
              {categoryAvgRating.toFixed(1)}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground flex gap-1 items-center">
              Semua kategori:{" "}
              {[...Array(5)].map((_, i) => {
                return (
                  <Icon
                    key={i}
                    icon="radix-icons:star-filled"
                    width=".8em"
                    height=".8em"
                    style={{
                      color: i + 1 > workerAvgRating ? "#9A8F85" : "#F97316",
                    }}
                  />
                );
              })}
              {workerAvgRating?.toFixed(1)}
            </p>
          </div>
        </div>
        <div className="w-full sm:flex-1">
          <div className="w-full rounded-md border border-border bg-background p-3">
            <p className="text-[11px] font-semibold text-muted-foreground tracking-wide">
              PESAN PENAWARAN
            </p>
            <p
              ref={messageRef}
              className={cn(
                "mt-2 text-sm text-muted-foreground",
                !isExpanded && "max-h-15 overflow-hidden",
              )}
            >
              {message || "Tidak ada pesan dari pekerja."}
            </p>
            {(isOverflow || isExpanded) && (
              <button
                type="button"
                className="mt-2 text-xs font-semibold text-primary hover:cursor-pointer"
                onClick={() => setIsExpanded((prev) => !prev)}
              >
                {isExpanded ? "Lihat lebih sedikit" : "Lihat selengkapnya"}
              </button>
            )}
          </div>
        </div>
      </div>


      <div className="w-full sm:w-fit flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-6">
        <p>
          <span className="text-muted-foreground font-normal">Penawaran:</span>{" "}
          <span className="text-lg font-dm-mono text-success-foreground">
            Rp {bid.proposedPrice.toLocaleString("id-ID")}
          </span>
        </p>
        {bid.status === "pending" ? (
          <div className="flex gap-2 self-end md:justify-self-end">
            <Button
              variant={"outline"}
              onClick={handleVisitProfile}
            >
              Lihat Profil
            </Button>
            <Button onClick={() => setIsDialogBidAcceptOpen(true)}>
              Terima Tawaran
            </Button>
          </div>
        ) : bid.status === "accepted" ? (
          <div className="flex gap-2 self-end md:justify-self-end">
            <Button variant={"secondary"}>Diterima</Button>
          </div>
        ) : bid.status === "rejected" ? (
          <div className="flex gap-2 self-end md:justify-self-end">
            <Button variant={"destructive"}>Ditolak</Button>
          </div>
        ) : (
          bid.status === "withdrawn" && (
            <div className="flex gap-2 self-end md:justify-self-end">
              <Button variant={"destructive"}>Dibatalkan</Button>
            </div>
          )
        )}
      </div>

      <DialogBidAccept
        bid={bid}
        jobTitle={jobTitle}
        isDialogBidAcceptOpen={isDialogBidAcceptOpen}
        setIsDialogBidAcceptOpen={setIsDialogBidAcceptOpen}
      />
    </li>
  );
};
