import { useMe, useUserById } from "@/features/user/hooks/userHooks";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import type { JobAssignment } from "@/shared/types/entity.type";
import { Icon } from "@iconify-icon/react";
import { useMemo, useState } from "react";
import { DialogBidCreate } from "./DialogBidCreate";
import Skeleton from "@/shared/components/Skeleton";
import { useNavigate } from "react-router";

const DialogJobDetail = ({
  job,
  isDialogDetailOpen,
  setIsDialogDetailOpen,
}: {
  job: JobAssignment;
  isDialogDetailOpen: boolean;
  setIsDialogDetailOpen: (open: boolean) => void;
}) => {
  const navigate = useNavigate();
  const { user } = useMe();
  const [isBidOpen, setIsBidOpen] = useState(false);
  const startAt = new Date(job.startAt);
  const deadlineAt = new Date(job.deadlineAt);
  const diffTime = deadlineAt.getTime() - startAt.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const {
    data: clientData,
    isLoading,
    isError,
    error,
  } = useUserById(job.client.id);
  const initials = useMemo(() => {
    return clientData?.user?.fullName
      ? clientData.user.fullName
          .split(" ")
          .map((n, i) => (i < 2 ? n[0] : ""))
          .join("")
      : "";
  }, [clientData]);
  const clientProfile = clientData?.profile;
  const clientAvgRating =
    clientData?.profile && "avgRating" in clientData.profile
      ? clientData.profile.avgRating
      : 0;

  const avatarContent =
    clientProfile && "avatarUrl" in clientProfile && clientProfile.avatarUrl ? (
      <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
        <img
          src={clientProfile.avatarUrl}
          alt="avatar image"
          className="w-full h-full object-cover object-center"
        />
      </div>
    ) : (
      <div className="w-10 h-10 rounded-full border-2 border-ring flex justify-center items-center bg-accent shrink-0">
        <span className="font-bold text-accent-foreground text-[13px]">
          {initials}
        </span>
      </div>
    );

  const handleVisitProfile = () => {
    const clientId = clientData?.user?.id;
    if (clientId) {
      navigate(`/profile/${clientId}`);
    }
  };

  return (
    <>
      <Dialog
        open={isDialogDetailOpen}
        onOpenChange={setIsDialogDetailOpen}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="flex gap-2 items-center">
              <div className="w-full flex items-center gap-3">
                {avatarContent}
                <div className="flex flex-col">
                  <span className="font-bold text-lg">
                    {clientData?.user?.fullName}
                  </span>
                  <span className="flex gap-0.5 items-center">
                    {isLoading ? (
                      <Skeleton className="w-20 h-3" />
                    ) : isError ? (
                      <span className="text-sm text-destructive">
                        {error instanceof Error
                          ? error.message
                          : "Gagal memuat rating."}
                      </span>
                    ) : (
                      <>
                        {[...Array(5)].map((_, i) => {
                          return (
                            <Icon
                              key={i}
                              icon="radix-icons:star-filled"
                              width=".8em"
                              height=".8em"
                              style={{
                                color:
                                  i + 1 > clientAvgRating
                                    ? "#9A8F85"
                                    : "#F97316",
                              }}
                            />
                          );
                        })}{" "}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {clientAvgRating.toFixed(1)}
                        </span>
                      </>
                    )}
                  </span>
                </div>

                <Button
                  className="ml-auto"
                  variant={"outline"}
                  onClick={handleVisitProfile}
                >
                  Lihat Profil
                </Button>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center gap-4 sm:gap-6">
            <div className="flex flex-col gap-2 w-full">
              <Badge>{job.category.name}</Badge>
              <span className="font-semibold text-lg sm:text-xl line-clamp-2">
                {job.title}
              </span>
            </div>

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
            {user?.role === "worker" && (
              <Button
                onClick={() => {
                  setIsDialogDetailOpen(false);
                  setIsBidOpen(true);
                }}
              >
                Ajukan Penawaran
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DialogBidCreate
        job={job}
        isDialogBidOpen={isBidOpen}
        setIsDialogBidOpen={setIsBidOpen}
      />
    </>
  );
};

export default DialogJobDetail;
