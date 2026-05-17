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
import type {
  JobAssignment,
  Profile,
  User,
  WorkerAssignment,
  JobSummary,
} from "@/shared/types/entity.type";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { useParams } from "react-router";
import { useMeJobs } from "../hooks/clientHooks";
import {
  useUserAssignments,
  useUserById,
  useUserJobs,
} from "../hooks/userHooks";
import { useMeAssignments } from "../hooks/workerHooks";
import DialogJobRate from "./DialogJobRate";
import { JobItemSkeleton } from "./skeleton/JobItemSkeleton";
import { DialogJobEdit } from "./DialogJobEdit";
import { DialogJobDelete } from "./DialogJobDelete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import type { JobStatus } from "@/shared/types/common.type";
import { useUpdateJobStatus } from "@/features/jobs/hooks/jobHooks";
type ProfileContentJobsProps = {
  sessionUser: User | null;
  sessionProfile: Profile | null;
};

const ProfileContentJobs = ({ sessionUser }: ProfileContentJobsProps) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { userId } = useParams();
  const isOwnProfile = !userId || userId === sessionUser?.id;
  const {
    data: viewedUserData,
    isLoading: isViewedUserLoading,
    isError: isViewedUserError,
    error: viewedUserError,
  } = useUserById(userId || "", !isOwnProfile);
  const targetUser = isOwnProfile ? sessionUser : viewedUserData?.user;
  const targetRole = targetUser?.role;

  const {
    data: clientData,
    isLoading: isLoadingJobs,
    isError: isClientJobsError,
    error: clientJobsError,
  } = useMeJobs({ page, limit });
  const dataJobs = (clientData?.data ?? []) as JobAssignment[];

  const {
    data: workerData,
    isLoading: isLoadingAssignments,
    isError: isWorkerJobsError,
    error: workerJobsError,
  } = useMeAssignments(page, limit);
  const dataAssignments = (workerData?.data ?? []) as WorkerAssignment[];

  const {
    data: userJobsData,
    isLoading: isUserJobsLoading,
    isError: isUserJobsError,
    error: userJobsError,
  } = useUserJobs({
    userId: userId || "",
    page,
    limit,
    enabled: !isOwnProfile && targetRole === "client",
  });
  const dataUserJobs = (userJobsData?.data ?? []) as JobAssignment[];

  const {
    data: userAssignmentsData,
    isLoading: isUserAssignmentsLoading,
    isError: isUserAssignmentsError,
    error: userAssignmentsError,
  } = useUserAssignments({
    userId: userId || "",
    page,
    limit,
    enabled: !isOwnProfile && targetRole === "worker",
  });
  const dataUserAssignments = (userAssignmentsData?.data ??
    []) as WorkerAssignment[];

  const isClient = targetRole === "client";
  const jobs = isClient
    ? isOwnProfile
      ? dataJobs
      : dataUserJobs
    : isOwnProfile
      ? dataAssignments
      : dataUserAssignments;
  const isLoading = isOwnProfile
    ? isClient
      ? isLoadingJobs
      : isLoadingAssignments
    : isViewedUserLoading ||
      (isClient ? isUserJobsLoading : isUserAssignmentsLoading);
  const isError = isOwnProfile
    ? isClient
      ? isClientJobsError
      : isWorkerJobsError
    : isViewedUserError ||
      (isClient ? isUserJobsError : isUserAssignmentsError);
  const errorMessage = isOwnProfile
    ? isClient
      ? clientJobsError instanceof Error
        ? clientJobsError.message
        : "Terjadi kesalahan saat memuat pekerjaan."
      : workerJobsError instanceof Error
        ? workerJobsError.message
        : "Terjadi kesalahan saat memuat pekerjaan."
    : viewedUserError instanceof Error
      ? viewedUserError.message
      : isClient
        ? userJobsError instanceof Error
          ? userJobsError.message
          : "Terjadi kesalahan saat memuat pekerjaan."
        : userAssignmentsError instanceof Error
          ? userAssignmentsError.message
          : "Terjadi kesalahan saat memuat pekerjaan.";
  const totalCount = isOwnProfile
    ? isClient
      ? clientData?.meta?.total
      : workerData?.meta?.total
    : isClient
      ? userJobsData?.meta?.total
      : userAssignmentsData?.meta?.total;
  const emptyMessage = isClient
    ? "Belum ada pekerjaan yang dibuat."
    : "Belum ada pekerjaan yang dikerjakan.";

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        {isLoading ? (
          [...Array(2)].map((_, i) => <JobItemSkeleton key={i} />)
        ) : isError ? (
          <p className="text-center text-sm text-destructive">{errorMessage}</p>
        ) : jobs.length > 0 ? (
          jobs.map((item) => (
            <JobItem
              key={"job" in item ? item?.assignmentId : item.id}
              item={item}
              canEditStatus={isOwnProfile && isClient}
              isOwnProfile={isOwnProfile}
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

const JobItem = ({
  item,
  canEditStatus,
  isOwnProfile,
}: {
  item: JobAssignment | WorkerAssignment;
  canEditStatus: boolean;
  isOwnProfile: boolean;
}) => {
  const isWorkerAssignment = (value: JobAssignment | WorkerAssignment): value is WorkerAssignment =>
    "job" in value;

  const job = isWorkerAssignment(item) ? item.job : item;
  const clientJob = !isWorkerAssignment(item) ? item : null;
  const assignmentIds = isWorkerAssignment(item)
    ? [item.assignmentId]
    : item?.assignments?.map((assignment) => assignment.assignmentId);
  const hasReviewed = isWorkerAssignment(item)
    ? item.hasReviewed
    : item?.assignments?.every((assignment) => assignment.hasReviewed);
  const [dialogData, setDialogData] = useState<
    | { type: "detail" | "rating"; job: JobSummary; assignmentId?: string }
    | { type: "edit" | "delete"; job: JobAssignment }
    | null
  >(null);
  const { mutate: updateJobStatus, isPending } = useUpdateJobStatus();
  const startDate = new Date(job.startAt);
  const deadlineDate = new Date(job.deadlineAt);
  const diffTime = Math.abs(deadlineDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const statusVariant =
    job.status === "open"
      ? "professional"
      : job.status === "completed"
        ? "success"
        : job.status === "in_progress"
          ? "warning"
          : "destructive";
  const statusLabel =
    job.status === "open"
      ? "Dibuka"
      : job.status === "in_progress"
        ? "Sedang dikerjakan"
        : "Selesai";

  const statusOptions: Array<{ value: JobStatus; label: string }> = [
    { value: "in_progress", label: "Sedang dikerjakan" },
    { value: "completed", label: "Selesai" },
    { value: "cancelled", label: "Dibatalkan" },
  ];

  const canRate =
    isOwnProfile &&
    job.status === "completed" &&
    assignmentIds.length > 0 &&
    !hasReviewed;

  const canManageJob = canEditStatus && !!clientJob;

  return (
    <>
      <li className="p-3 sm:p-5 rounded-md flex flex-col gap-4 shadow-md border border-border">
        {/* badge */}
        <div className="w-full flex justify-between">
          <Badge withDot>{job.category.name}</Badge>
          {canEditStatus && job.status === "in_progress" ? (
            <Select
              value={job.status}
              onValueChange={(value) => {
                if (value !== job.status) {
                  updateJobStatus({
                    jobId: job.id,
                    status: value as JobStatus,
                  });
                }
              }}
              disabled={isPending}
            >
              <SelectTrigger className="h-7 px-2 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Badge
              variant={statusVariant}
              withDot
            >
              {statusLabel}
            </Badge>
          )}
        </div>

        {/* title */}
        <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
          {job.title}
        </h3>

        {/* action */}
        <div className="w-full flex justify-end gap-3">
          {canRate && (
            <Button
              onClick={() =>
                setDialogData({
                  type: "rating",
                  job,
                  assignmentId: assignmentIds[0],
                })
              }
            >
              Beri Penilaian
            </Button>
          )}
          <Button
            variant={"outline"}
            onClick={() => setDialogData({ type: "detail", job })}
          >
            Detail
          </Button>
        </div>
      </li>

      {/* dialog rating */}
      {dialogData?.type === "rating" && (
        <DialogJobRate
          isDialogRatingOpen={dialogData?.type === "rating"}
          setIsDialogRatingOpen={(open: boolean) => {
            if (!open) setDialogData(null);
          }}
          job={dialogData.job}
          assignmentId={dialogData.assignmentId}
        />
      )}

      {/* dialog detail job */}
      {dialogData?.type === "detail" && (
        <Dialog
          open={dialogData?.type === "detail"}
          onOpenChange={(open) => {
            if (!open) setDialogData(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex flex-col gap-2">
                <Badge>{dialogData.job.category.name}</Badge>
                <span className="font-semibold text-lg sm:text-xl line-clamp-2">
                  {dialogData.job.title}
                </span>
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
                  {dialogData.job.locationDistrict},{" "}
                  {dialogData.job.locationCity}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Icon
                    icon="lets-icons:date-today-light"
                    width="1em"
                    height="1em"
                    style={{ color: "#F97316" }}
                  />{" "}
                  {new Date(dialogData.job.startAt).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "short",
                    },
                  )}{" "}
                  -{" "}
                  {new Date(dialogData.job.deadlineAt).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "short",
                    },
                  )}{" "}
                  <b>({diffDays} hari)</b>
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Icon
                    icon="ic:baseline-group"
                    width="1em"
                    height="1em"
                    style={{ color: "#F97316" }}
                  />
                  {dialogData.job.workersNeeded} orang pekerja
                </p>
              </div>

              <div className="w-full h-fit max-h-40 overflow-y-auto">
                {dialogData.job.description}
              </div>
            </div>
            <DialogFooter>
              {canManageJob && job.status === "open" && (
                <>
                  <Button
                    variant="secondary"
                    onClick={() =>
                      clientJob && setDialogData({ type: "edit", job: clientJob })
                    }
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() =>
                      clientJob &&
                        setDialogData({ type: "delete", job: clientJob })
                    }
                  >
                    Hapus
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

        {dialogData?.type === "edit" && (
        <DialogJobEdit
          isDialogJobEditOpen={dialogData?.type === "edit"}
          setIsDialogJobEditOpen={(open: boolean) => {
            if (!open) setDialogData(null);
          }}
          job={dialogData.job}
        />
      )}

        {dialogData?.type === "delete" && (
        <DialogJobDelete
          isDialogJobDeleteOpen={dialogData?.type === "delete"}
          setIsDialogJobDeleteOpen={(open: boolean) => {
            if (!open) setDialogData(null);
          }}
          job={dialogData.job}
        />
      )}
    </>
  );
};
