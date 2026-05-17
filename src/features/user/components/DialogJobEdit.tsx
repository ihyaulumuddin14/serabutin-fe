import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/shared/components/ui/dialog";
import type { JobAssignment } from "@/shared/types/entity.type";
import EditJobForm from "./EditJobForm";

export const DialogJobEdit = ({
  job,
  isDialogJobEditOpen,
  setIsDialogJobEditOpen,
}: {
  job: JobAssignment;
  isDialogJobEditOpen: boolean;
  setIsDialogJobEditOpen: (open: boolean) => void;
}) => {
  return (
    <Dialog open={isDialogJobEditOpen} onOpenChange={setIsDialogJobEditOpen}>
      <DialogContent className="max-h-[90vh] overflow-y-hidden!">
        <DialogHeader>
          <DialogTitle>
            <h2 className="font-bold text-xl sm:text-2xl">Edit Pekerjaan</h2>
          </DialogTitle>
          <DialogDescription>
            Sesuaikan informasi pekerjaan yang ingin kamu edit, lalu klik simpan
            untuk menyimpan perubahan.
          </DialogDescription>
        </DialogHeader>
        <div className="w-full max-h-[70vh] overflow-y-auto mb-4">
          <EditJobForm job={job} setIsDialogJobEditOpen={setIsDialogJobEditOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
