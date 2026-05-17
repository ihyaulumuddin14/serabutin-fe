import { useGetBidsOfJob, useMeJobs } from "@/features/user/hooks/clientHooks";
import { useMe } from "@/features/user/hooks/userHooks";
import { useMeBids } from "@/features/user/hooks/workerHooks";
import { BidsDrawer } from "@/shared/components/NavbarMain";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { useIsMobile } from "@/shared/hooks/useAnimation";
import type {
  Bid,
  JobAssignment,
  Profile,
  User,
} from "@/shared/types/entity.type";
import { Icon } from "@iconify-icon/react";
import { Plus } from "lucide-react";
import { Link, useNavigate } from "react-router";
import JobOfferSkeleton from "./skeleton/JobOfferSkeleton";
import { PaginationWithLinks } from "@/shared/components/ui/pagination-with-links";
import { useState } from "react";
import { DialogBidDelete } from "./DialogBidDelete";

const JobOffer = () => {
  const navigate = useNavigate();
  const { user, isLoading, isError, error } = useMe();
  const isMobile = useIsMobile();

  const handlePostJob = () => {
    navigate("/job-post");
  };

  if (isLoading) {
    return (
      <div className="w-full h-fit bg-card flex flex-col justify-center p-4 sm:p-6 shadow-md rounded-md">
        <div className="flex flex-col gap-3">
          {[...Array(2)].map((_, i) => (
            <JobOfferSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-fit bg-card flex flex-col justify-center p-4 sm:p-6 shadow-md rounded-md">
        <p className="text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memuat data pengguna."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-fit bg-card flex flex-col justify-center p-4 sm:p-6 shadow-md rounded-md">
      {user?.role === "client" && (
        <Button
          className="mb-8 font-bold text-base! p-6"
          onClick={handlePostJob}
        >
          <Plus />
          Posting Kebutuhan Jasa
        </Button>
      )}

      <h3 className="text-muted-foreground text-[12px] pl-2 border-l-2 border-primary font-bold tracking-[1.2px]">
        {user?.role === "client"
          ? "PENAWARAN DARI PEKERJA"
          : "STATUS PENAWARAN SAYA"}
      </h3>

      {user?.role === "client" ? (
        <JobBidList />
      ) : (
        <>
          <BidList enabledBidsFetch={!isMobile} page={1} limit={1}/>
          <BidsDrawer triggerOption="text" />
        </>
      )}
    </div>
  );
};

export default JobOffer;

const JobBidList = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(1);
  const { data, isLoading, isError, error } = useMeJobs({
    page,
    limit,
    status: "open",
  });
  const jobBids: JobAssignment[] = data?.data ?? [];
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Terjadi kesalahan saat memuat pekerjaan.";

  return (
    <>
      <ol className="flex flex-col gap-3 my-3">
        {isLoading ? (
          [...Array(2)].map((_, i) => <JobOfferSkeleton key={i} />)
        ) : isError ? (
          <p className="text-center text-sm text-destructive">{errorMessage}</p>
        ) : jobBids.length > 0 ? (
          jobBids.map((job) => (
            <JobBidItem
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
    </>
  );
};

export const JobBidItem = ({
  job,
  className,
}: {
  job: JobAssignment;
  className?: string;
}) => {
  const { data, isLoading, isError, error } = useGetBidsOfJob(job.id);
  const totalBids = data?.meta?.total ?? 0;
  const errorMessage =
    error instanceof Error ? error.message : "Gagal memuat jumlah tawaran.";

  return (
    <li
      className={`w-full p-3 rounded-lg border border-border bg-background flex flex-col gap-2 ${className}`}
    >
      <p className="font-semibold line-clamp-2">{job.title}</p>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Memuat tawaran...</p>
      ) : isError ? (
        <p className="text-sm text-destructive">{errorMessage}</p>
      ) : totalBids > 0 ? (
        <Link
          to={`/job-bids/${job.id}`}
          className="text-primary hover:underline"
        >
          Lihat {totalBids} tawaran
        </Link>
      ) : (
        <p className="text-sm text-muted-foreground">Belum ada tawaran.</p>
      )}
    </li>
  );
};

export const BidList = ({
  enabledBidsFetch,
  page,
  limit,
}: {
  enabledBidsFetch: boolean;
  page: number;
  limit: number;
}) => {
  const { data, isLoading, isError, error } = useMeBids({
    page,
    limit,
    enabled: enabledBidsFetch,
  });
  const bids = data?.data ?? [];
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Terjadi kesalahan saat memuat penawaran.";

  return (
    <>
      <ol className="flex flex-col gap-3 mt-3">
        {isLoading ? (
          [...Array(2)].map((_, i) => <JobOfferSkeleton key={i} />)
        ) : isError ? (
          <p className="text-center text-sm text-destructive">{errorMessage}</p>
        ) : bids.length > 0 ? (
          bids.map(({ bid, job: jobAssignment, client }) => (
            <WorkerBidItem
              client={client}
              key={bid.id}
              bid={bid}
              job={jobAssignment}
            />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Anda belum melakukan penawaran apapun.
          </p>
        )}
      </ol>
    </>
  );
};

const WorkerBidItem = ({
  bid,
  job,
  client,
}: {
  bid: Bid;
  job: JobAssignment;
  client: Omit<User, "email" | "isVerified" | "isActive"> &
    Partial<Pick<Profile, "phone">>;
}) => {
  const [isDialogBidDeleteOpen, setIsDialogBidDeleteOpen] = useState(false);
  const handleWhatsappChat = () => {
    const clientPhoneNumber = client.phone;
    const whatsappUrl = `https://wa.me/${clientPhoneNumber}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      <li className="w-full p-3 rounded-lg border border-border bg-background flex flex-col gap-2">
        <p className="font-semibold">{job.title}</p>
        <Badge
          variant={
            bid.status === "accepted"
              ? "success"
              : bid.status === "pending"
                ? "warning"
                : "destructive"
          }
        >
          {bid.status === "accepted"
            ? "Diterima"
            : bid.status === "pending"
              ? "Menunggu"
              : bid.status === "rejected"
                ? "Ditolak"
                : "Dibatalkan"}
        </Badge>
        {bid.status === "accepted" ? (
          <Button
            className="bg-success-foreground text-primary-foreground hover:bg-success shadow-none"
            onClick={handleWhatsappChat}
          >
            <Icon
              icon="ic:baseline-whatsapp"
              width="1.5em"
              height="1.5em"
              style={{ color: "#F1EEEA" }}
            />
            Chat WhatsApp Klien
          </Button>
        ) : (
          bid.status === "pending" && (
            <Button
              variant={"destructive"}
              onClick={() => setIsDialogBidDeleteOpen(true)}
            >
              Batalkan Penawaran
            </Button>
          )
        )}
      </li>
      <DialogBidDelete
        bid={bid}
        job={job}
        isDialogBidDeleteOpen={isDialogBidDeleteOpen}
        setIsDialogBidDeleteOpen={setIsDialogBidDeleteOpen}
      />
    </>
  );
};
