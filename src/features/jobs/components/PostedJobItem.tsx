import type { JobAssignment } from "@/shared/types/entity.type";
import { Icon } from "@iconify-icon/react";
import DialogJobDetail from "./DialogJobDetail";
import { DialogBidCreate } from "./DialogBidCreate";
import { forwardRef, useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Timer } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useMe } from "@/features/user/hooks/userHooks";

export const PostedJobItem = forwardRef<HTMLLIElement, { job: JobAssignment }>(
  ({ job }, ref) => {
    const diffTime = new Date().getTime() - new Date(job.createdAt).getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const [isOpen, setIsOpen] = useState(false);
    const [isBidOpen, setIsBidOpen] = useState(false);
    const { user } = useMe();

    let finalDiff = "Baru saja";

    if (diffDays > 0) {
      finalDiff = `${diffDays} hari yang lalu`;
    } else if (diffHours > 0) {
      finalDiff = `${diffHours} jam yang lalu`;
    } else if (diffMinutes > 0) {
      finalDiff = `${diffMinutes} menit yang lalu`;
    }

    return (
      <>
        <li
          ref={ref}
          className="w-full h-fit p-6 bg-card rounded-lg shadow-md flex flex-col gap-2"
        >
          {/* upper */}
          <div className="w-full flex justify-between items-center gap-3">
            <Badge>{job.category.name}</Badge>
            <span className="text-xs sm:text-sm text-muted-foreground flex gap-1 items-center">
              <Timer className="size-6 sm:size-7" />
              {finalDiff}
            </span>
          </div>

          {/* header */}
          <h3 className="font-bold text-base">{job.title}</h3>

          {/* description */}
          <p className="text-sm font-normal text-muted-foreground line-clamp-2">
            {job.description}
          </p>

          {/* location and price */}
          <div className="w-full font-normal flex sm:flex-row my-2 sm:my-0 items-start sm:items-center flex-col gap-2 sm:gap-4 pb-3 border-b text-xs lg:text-sm">
            <p className="font-semibold text-muted-foreground flex items-center gap-2">
              <Icon
                icon="rivet-icons:map-pin-solid"
                width="1em"
                height="1em"
                style={{ color: "#F97316" }}
              />
              {job.locationDistrict}, {job.locationCity}
            </p>
            <p className="font-semibold text-muted-foreground flex items-center gap-2">
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
              })}
            </p>
            <p className="font-semibold text-muted-foreground flex items-center gap-2 bg-muted py-1 px-2 rounded-md">
              <Icon
                icon="ic:baseline-group"
                width="1em"
                height="1em"
                style={{ color: "#F97316" }}
              />
              {job.workersNeeded} orang pekerja
            </p>
          </div>

          <div className="w-full flex justify-between">
            <p className="text-sm text-muted-foreground flex gap-2">
              <span>Budget</span>
              <span className="text-primary text-sm sm:text-base font-medium font-dm-mono line-clamp-1">
                Rp{" "}
                {Number(job?.budgetMin)?.toLocaleString("id-ID", {
                  minimumFractionDigits: 0,
                })}{" "}
                -{" "}
                {Number(job?.budgetMax)?.toLocaleString("id-ID", {
                  minimumFractionDigits: 0,
                })}
              </span>
            </p>
          </div>

          <div className="w-full flex gap-2 justify-end mt-1">
            {user?.role === "worker" && (
              <Button onClick={() => setIsBidOpen(true)}>
                Ajukan Penawaran
              </Button>
            )}
            <Button
              variant={"outline"}
              onClick={() => setIsOpen(true)}
            >
              Detail
            </Button>
          </div>
        </li>

        <DialogJobDetail
          job={job}
          isDialogDetailOpen={isOpen}
          setIsDialogDetailOpen={setIsOpen}
        />

        <DialogBidCreate
          job={job}
          isDialogBidOpen={isBidOpen}
          setIsDialogBidOpen={setIsBidOpen}
        />
      </>
    );
  },
);
