import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import type { Bid, JobAssignment } from "@/shared/types/entity.type";
import { useCancelBid } from "@/features/user/hooks/workerHooks";
import { useEffect } from "react";

export const DialogBidDelete = ({
  bid,
  job,
  isDialogBidDeleteOpen,
  setIsDialogBidDeleteOpen,
}: {
  bid: Bid;
  job: JobAssignment;
  isDialogBidDeleteOpen: boolean;
  setIsDialogBidDeleteOpen: (open: boolean) => void;
}) => {
  const { mutate, isPending, isSuccess } = useCancelBid();

  useEffect(() => {
    if (isSuccess) {
      setIsDialogBidDeleteOpen(false);
    }
  }, [isSuccess, setIsDialogBidDeleteOpen]);

  return (
    <Dialog
      open={isDialogBidDeleteOpen}
      onOpenChange={setIsDialogBidDeleteOpen}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            <h3 className="font-bold text-xl">Batalkan penawaran?</h3>
          </DialogTitle>
          <DialogDescription>
            Penawaran untuk pekerjaan <strong>"{job.title}"</strong> akan
            dibatalkan dan tidak bisa dipulihkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setIsDialogBidDeleteOpen(false)}
            disabled={isPending}
          >
            Tidak
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutate(bid.id)}
            disabled={isPending}
          >
            Ya
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
