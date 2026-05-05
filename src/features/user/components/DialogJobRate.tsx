import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/shared/components/ui/field";
import { Textarea } from "@/shared/components/ui/textarea";
import type { Job, User } from "@/shared/types/entity.type";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { useGetWorkers } from "../hooks/clientHooks";
import { useMe } from "../hooks/userHooks";
import { RatingItemSkeleton } from "./skeleton/RatingItemSkeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { ReviewSchema, type ReviewCredentials } from "../schemas/reviewSchemas";

const DialogJobRate = ({
  isDialogRatingOpen,
  setIsDialogRatingOpen,
  job,
}: {
  isDialogRatingOpen: boolean;
  setIsDialogRatingOpen: (open: boolean) => void;
  job: Job;
}) => {
  const { data: workers, isPending: isWorkersPending } = useGetWorkers(job.id);
  const { user } = useMe();

  return (
    <Dialog
      open={isDialogRatingOpen}
      onOpenChange={setIsDialogRatingOpen}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex flex-col gap-2">
            Beri Penilaian untuk {user?.role === "client" ? "Pekerja" : "Klien"} Anda
          </DialogTitle>
        </DialogHeader>

        <div className="w-full h-fit max-h-100 overflow-y-auto">
          <ul className="w-full h-fit flex flex-col gap-3">
            {(user?.role === "client" && isWorkersPending) && <RatingItemSkeleton />}

            {user?.role === "client" && workers && (
              <>
                {workers?.map((worker) => (
                  <PartnerRateItem
                    key={worker.id}
                    jobId={job.id}
                    partner={worker}
                  />
                ))}
              </>
            )}

            {user?.role === "worker" && job.client && (
              <PartnerRateItem
                key={job.client.id}
                partner={job.client}
                jobId={job.id}
              />
            )}
          </ul>
        </div>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setIsDialogRatingOpen(false)}
          >
            Tutup Detail
          </Button>
          <Button disabled>Kirim Penilaian</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogJobRate;

const PartnerRateItem = ({
  partner,
  jobId,
}: {
  partner: Omit<User, "email" | "isVerified" | "isActive">;
  jobId: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const initials = partner.fullName
    ? partner.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "";

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<ReviewCredentials>({
    resolver: zodResolver(ReviewSchema),
    mode: "onChange",
    defaultValues: {
      assignmentId: "",
      rating: 0,
      comment: "",
    },
  });

  const avatarContent = (
    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-full border-2 border-ring flex justify-center items-center bg-accent">
      <span className="font-bold text-accent-foreground text-[13px] sm:text-lg">
        {initials}
      </span>
    </div>
  );

  const handleSaveToLocalStorage = (data: ReviewCredentials) => {
    // TODO: temporary save to local storage, will be sent to server when user click "Kirim Penilaian"
  };

  return (
    <li className="w-full p-3 flex items-center gap-3 border border-border shadow-md rounded-md">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full"
      >
        <CollapsibleTrigger className="w-full flex items-center gap-3 justify-between cursor-pointer hover:bg-muted rounded-md p-2">
          <div className="w-fit flex gap-2 items-center">
            {avatarContent}
            <div className="flex flex-col gap-1">
              <p className="font-semibold text-lg">{partner.fullName}</p>
              <Badge variant={"warning"}>Belum Dinilai</Badge>
            </div>
          </div>
          <Icon
            className="transition-all duration-150 ease-in-out"
            icon="iconamoon:arrow-down-2"
            width="2em"
            height="2em"
            style={{
              color: "#7A6A5A",
              transform: isOpen ? "rotate(180deg)" : "none",
            }}
          />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <form
            onSubmit={handleSubmit(handleSaveToLocalStorage)}
            className="flex flex-col gap-3 mt-3"
          >
            <Field>
              <Controller
                name="rating"
                control={control}
                render={({ field }) => (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => {
                      const isActive = i <= (field.value || 0)

                      return (
                        <Icon
                          key={i}
                          onClick={() => field.onChange(i)}
                          icon={isActive ? "mdi:star" : "mdi:star-outline"}
                          width="1.8em"
                          height="1.8em"
                          style={{ color: "#F97316", cursor: "pointer" }}
                        />
                      )
                    })}
                  </div>
                )}
              />
              {errors.rating && (
                <FieldError className="text-xs w-full text-right">
                  {errors.rating?.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel>Komentar</FieldLabel>
              <Textarea
                placeholder="Ulasan Anda..."
                className="text-sm sm:text-base"
                {...register("comment")}
              />
            </Field>

            <div className="w-full flex justify-end gap-3">
              <Button
                type="button"
                className="w-fit"
                variant="outline"
                onClick={() => setIsOpen(false)}
              >
                Batal
              </Button>
              <Button
                type="submit"
                className="w-fit"
              >
                Simpan
              </Button>
            </div>
          </form>
        </CollapsibleContent>
      </Collapsible>
    </li>
  );
};
