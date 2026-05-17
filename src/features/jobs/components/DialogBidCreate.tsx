import { useCreateBid } from "@/features/user/hooks/workerHooks";
import {
  BidSchema,
  type BidCredentials,
} from "@/features/user/schemas/bidSchemas";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import type { JobAssignment } from "@/shared/types/entity.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { Controller, useForm, type Resolver } from "react-hook-form";
import z from "zod";

export const DialogBidCreate = ({
  job,
  isDialogBidOpen,
  setIsDialogBidOpen,
}: {
  job: JobAssignment;
  isDialogBidOpen: boolean;
  setIsDialogBidOpen: (open: boolean) => void;
}) => {
  const defaultValues: Partial<BidCredentials> = {
    proposedPrice: undefined,
    message: "",
  };

  const schema = useMemo(
    () =>
      BidSchema.superRefine((data, ctx) => {
        if (
          data.proposedPrice < job.budgetMin ||
          data.proposedPrice > job.budgetMax
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.too_small,
            minimum: job.budgetMin,
            maximum: job.budgetMax,
            type: "number",
            inclusive: true,
            message: `Harga penawaran harus antara Rp ${job.budgetMin} dan Rp ${job.budgetMax}`,
            path: ["proposedPrice"],
            origin: "server",
          });
        }
      }),
    [job.budgetMin, job.budgetMax],
  );

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<BidCredentials>({
    resolver: zodResolver(schema) as Resolver<BidCredentials>,
    mode: "onChange",
    defaultValues,
  });

  const { mutate: createBid, isPending } = useCreateBid();

  const handleClose = () => {
    setIsDialogBidOpen(false);
  };

  const onSubmit = (data: BidCredentials) => {
    createBid(
      { jobId: job.id, payload: data },
      {
        onSuccess: () => {
          reset(defaultValues);
          handleClose();
        },
      },
    );
  };

  return (
    <Dialog
      open={isDialogBidOpen}
      onOpenChange={setIsDialogBidOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <h3 className="text-muted-foreground text-[12px] pl-2 border-l-2 border-primary font-bold tracking-[1.2px]">
              AJUKAN PENAWARAN UNTUK 
            </h3>
          </DialogTitle>
        </DialogHeader>

        <h3 className="text-lg font-semibold">{job.title}</h3>

        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <FieldGroup className="gap-4">
            <Field>
              <FieldLabel>Harga penawaran</FieldLabel>
              <Controller
                control={control}
                name="proposedPrice"
                render={({ field }) => (
                  <Input
                    {...field}
                    nominal
                    prefixText="Rp"
                    placeholder="Masukkan harga penawaran"
                    value={field.value ?? ""}
                    error={errors.proposedPrice?.message}
                  />
                )}
              />
            </Field>

            <Field>
              <FieldLabel>Pesan</FieldLabel>
              <Controller
                control={control}
                name="message"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    value={field.value ?? ""}
                    className="min-h-24 resize-none text-sm"
                    placeholder="Tulis pesan singkat untuk klien"
                  />
                )}
              />
              {errors.message?.message && (
                <FieldError className="text-xs">
                  * {errors.message.message}
                </FieldError>
              )}
            </Field>
          </FieldGroup>

          <DialogFooter className="mt-6">
            <Button
              type="submit"
              disabled={isPending}
            >
              Ajukan
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleClose}
              disabled={isPending}
            >
              Batal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
