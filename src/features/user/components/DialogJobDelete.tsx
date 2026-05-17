import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import type { JobAssignment } from "@/shared/types/entity.type";
import { useDeleteJob } from "@/features/jobs/hooks/jobHooks";
import { useEffect } from "react";

export const DialogJobDelete = ({
  job,
  isDialogJobDeleteOpen,
  setIsDialogJobDeleteOpen,
}: {
  job: JobAssignment;
  isDialogJobDeleteOpen: boolean;
  setIsDialogJobDeleteOpen: (open: boolean) => void;
}) => {
  const { mutate, isPending, isSuccess } = useDeleteJob();

  useEffect(() => {
    if (isSuccess) {
      setIsDialogJobDeleteOpen(false);
    }
  }, [isSuccess, setIsDialogJobDeleteOpen]);

  return (
    <Dialog
      open={isDialogJobDeleteOpen}
      onOpenChange={setIsDialogJobDeleteOpen}
    >
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Hapus pekerjaan?</DialogTitle>
          <DialogDescription>
            Tindakan ini tidak bisa dibatalkan. Pekerjaan akan dihapus secara
            permanen.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => setIsDialogJobDeleteOpen(false)}
            disabled={isPending}
          >
            Batal
          </Button>
          <Button
            variant="destructive"
            onClick={() => mutate(job.id)}
            disabled={isPending}
          >
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
