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
import type { Job } from "@/shared/types/entity.type";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { useMeJobs } from "../hooks/clientHooks";
import DialogJobRate from "./DialogJobRate";
import { JobItemSkeleton } from "./skeleton/JobItemSkeleton";

const mockListClientJobs: Job[] = [
  {
    id: "01932b2a-7c3d-7e4f-8a5b-6c7d8e9f0a1b",
    client: {
      id: "01932b2a-7c3d-7e4f-8a5b-6c7d8e9f0a1b",
      fullName: "John Doe",
      role: "client",
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
    category: {
      id: "01932b2a-7c3d-7e4f-8a5b-6c7d8e9f0a1b",
      name: "Web Development",
      slug: "web-development",
      isActive: true,
      createdAt: "2023-01-01T00:00:00Z",
      updatedAt: "2023-01-01T00:00:00Z",
    },
    title:
      "Create a responsive website Lorem ipsum dolor sit amet consectetur adipiscing elit",
    description: "I need a responsive website for my business.",
    budgetMin: 100,
    budgetMax: 500,
    workersNeeded: 1,
    locationDistrict: "Jakarta Selatan",
    locationCity: "Jakarta",
    status: "completed",
    startAt: "2023-01-01T00:00:00Z",
    deadlineAt: "2023-01-10T00:00:00Z",
    createdAt: "2023-01-01T00:00:00Z",
    updatedAt: "2023-01-01T00:00:00Z",
  },
];

const ProfileContentJobs = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isPending: isJobsPending } = useMeJobs(page, limit);
  const dataJobs: Job[] = (
    data?.data?.length ? data.data : mockListClientJobs
  ) as Job[];

  return (
    <>
      <div className="w-full flex flex-col gap-2">
        {isJobsPending ? (
          [...Array(2)].map((_, i) => (
            <JobItemSkeleton key={i} />
          ))
        ) : dataJobs.length > 0 ? (
          dataJobs.map((item) => (
            <JobItem
              key={item.id}
              job={item}
            />
          ))
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Belum ada pekerjaan yang dibuat.
          </p>
        )}
      </div>

      {!!data?.meta?.total && (
        <PaginationWithLinks
          page={page}
          pageSize={limit}
          totalCount={data.meta.total}
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

const JobItem = ({ job }: { job: Job }) => {
  const [isDialogDetailOpen, setIsDialogDetailOpen] = useState(false);
  const [isDialogRatingOpen, setIsDialogRatingOpen] = useState(false);
  const startDate = new Date(job.startAt);
  const deadlineDate = new Date(job.deadlineAt);
  const diffTime = Math.abs(deadlineDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <>
      <li className="p-3 sm:p-5 rounded-md flex flex-col gap-4 shadow-md border border-border">
        {/* badge */}
        <div className="w-full flex justify-between">
          <Badge withDot>{job.category.name}</Badge>
          <Badge
            variant={
              job.status === "open"
                ? "error"
                : job.status === "in_progress"
                  ? "warning"
                  : "success"
            }
            withDot
          >
            {job.status === "open"
              ? "Dibuka"
              : job.status === "in_progress"
                ? "Sedang dikerjakan"
                : "Selesai"}
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
                />
                {" "}
                {new Date(job.startAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })}{" "}
                - {" "}
                {new Date(job.deadlineAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                })} <b>({diffDays} hari)</b>
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
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              Assumenda alias minus beatae labore suscipit, expedita iure
              temporibus aut sed laboriosam quis quasi omnis excepturi sint
              vitae corporis vero eius commodi quia sequi voluptate, minima
              corrupti? Quae ex architecto et recusandae dolorem unde iste
              repellendus consequuntur est sed doloribus delectus tenetur, modi
              explicabo praesentium quod vero dignissimos. Sit odit tempore
              reprehenderit vero officia, alias eum quaerat accusamus veniam
              impedit? Quo totam molestias consequuntur quae, sequi accusantium
              voluptatum quos harum ipsa doloribus soluta molestiae accusamus
              laboriosam eligendi nam consectetur doloremque veritatis inventore
              placeat earum sed facere vero dolore. Et ipsam dicta deserunt.
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
