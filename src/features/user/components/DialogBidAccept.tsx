import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import type { Bid } from "@/shared/types/entity.type";
import { useAcceptBid } from "@/features/user/hooks/clientHooks";
import { useEffect } from "react";

export const DialogBidAccept = ({
  bid,
  jobTitle,
  isDialogBidAcceptOpen,
  setIsDialogBidAcceptOpen,
}: {
  bid: Bid;
  jobTitle: string;
  isDialogBidAcceptOpen: boolean;
  setIsDialogBidAcceptOpen: (open: boolean) => void;
}) => {
  const { mutate, isPending, isSuccess } = useAcceptBid();

  useEffect(() => {
    if (isSuccess) {
      setIsDialogBidAcceptOpen(false);
    }
  }, [isSuccess, setIsDialogBidAcceptOpen]);

  return (
    <Dialog
      open={isDialogBidAcceptOpen}
      onOpenChange={setIsDialogBidAcceptOpen}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            <h3 className="text-xl font-bold">Terima tawaran?</h3>
          </DialogTitle>
          <DialogDescription>
            Pekerja "{bid.worker.fullName}" akan diterima untuk pekerjaan "
            {jobTitle}".
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            onClick={() => mutate(bid.id)}
            disabled={isPending}
          >
            Terima Tawaran
          </Button>
          <Button
            variant="secondary"
            onClick={() => setIsDialogBidAcceptOpen(false)}
            disabled={isPending}
          >
            Batal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
