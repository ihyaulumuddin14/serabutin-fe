import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { PaginationWithLinks } from "@/shared/components/ui/pagination-with-links";
import type { JobAssignment } from "@/shared/types/entity.type";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { useMeAssignments, useMeJobs } from "../hooks/clientHooks";
import DialogJobRate from "./DialogJobRate";
import { JobItemSkeleton } from "./skeleton/JobItemSkeleton";
import { useMe } from "../hooks/userHooks";

const ProfileContentJobs = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { user } = useMe();

  // for client
  const { data: clientData, isLoading: isLoadingJobs } = useMeJobs(page, limit);
  const dataJobs = (clientData?.data ?? []) as JobAssignment[];

  // for worker
  const { data: workerData, isLoading: isLoadingAssignments } =
    useMeAssignments(page, limit);
  const dataAssignments = (workerData?.data ?? []) as JobAssignment[];

  // determine active data based on user role
  const isClient = user?.role === "client";
  const activeData = isClient ? dataJobs : dataAssignments;
  const isLoading = isClient ? isLoadingJobs : isLoadingAssignments;
  const totalCount = isClient
    ? clientData?.meta?.total
    : workerData?.meta?.total;
  const emptyMessage = isClient
    ? "Anda belum membuat pekerjaan apapun."
    : "Anda belum mengerjakan pekerjaan apapun.";

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        {isLoading ? (
          [...Array(2)].map((_, i) => <JobItemSkeleton key={i} />)
        ) : activeData.length > 0 ? (
          activeData.map((item) => (
            <JobItem
              key={item.id}
              job={item}
            />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            {emptyMessage}
          </p>
        )}
      </div>

      {!!totalCount && (
        <PaginationWithLinks
          page={page}
          pageSize={limit}
          totalCount={totalCount}
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

export default ProfileContentJobs;

const JobItem = ({ job }: { job: JobAssignment }) => {
  const [isDialogDetailOpen, setIsDialogDetailOpen] = useState(false);
  const [isDialogRatingOpen, setIsDialogRatingOpen] = useState(false);
  const startDate = new Date(job.startAt);
  const deadlineDate = new Date(job.deadlineAt);
  const diffTime = Math.abs(deadlineDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const statusVariant =
    job.status === "open"
      ? "error"
      : job.status === "in_progress"
        ? "warning"
        : "success";
  const statusLabel =
    job.status === "open"
      ? "Dibuka"
      : job.status === "in_progress"
        ? "Sedang dikerjakan"
        : "Selesai";

  return (
    <>
      <li className="p-3 sm:p-5 rounded-md flex flex-col gap-4 shadow-md border border-border">
        {/* badge */}
        <div className="w-full flex justify-between">
          <Badge withDot>{job.category.name}</Badge>
          <Badge
            variant={statusVariant}
            withDot
          >
            {statusLabel}
          </Badge>
        </div>

        {/* title */}
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
          {job.title}
        </h3>

        {/* action */}
        <div className="w-full flex justify-end gap-3">
          {job.status === "completed" && (
            <Button onClick={() => setIsDialogRatingOpen(true)}>
              Beri Penilaian
            </Button>
          )}
          <Button
            variant={"outline"}
            onClick={() => setIsDialogDetailOpen(true)}
          >
            Detail
          </Button>
        </div>
      </li>

      {/* dialog rating */}
      {isDialogRatingOpen && (
        <DialogJobRate
          isDialogRatingOpen={isDialogRatingOpen}
          setIsDialogRatingOpen={setIsDialogRatingOpen}
          job={job}
        />
      )}

      {/* dialog detail job */}
      <Dialog
        open={isDialogDetailOpen}
        onOpenChange={setIsDialogDetailOpen}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex flex-col gap-2">
              <Badge>{job.category.name}</Badge>
              <h3 className="font-semibold text-lg sm:text-xl line-clamp-2">
                {job.title}
              </h3>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
            {/* information job detail */}
            <div className="flex flex-col gap-1 self-start">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon
                  icon="rivet-icons:map-pin-solid"
                  width="1em"
                  height="1em"
                  style={{ color: "#F97316" }}
                />
                {job.locationDistrict}, {job.locationCity}
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon
                  icon="lets-icons:date-today-light"
                  width="1em"
                  height="1em"
                  style={{ color: "#F97316" }}
                />{" "}
                {new Date(job.startAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                -{" "}
                {new Date(job.deadlineAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                <b>({diffDays} hari)</b>
              </p>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Icon
                  icon="ic:baseline-group"
                  width="1em"
                  height="1em"
                  style={{ color: "#F97316" }}
                />
                {job.workersNeeded} orang pekerja
              </p>
            </div>

            <div className="w-full h-fit max-h-40 overflow-y-auto">
              {job.description}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setIsDialogDetailOpen(false)}
            >
              Tutup Detail
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
