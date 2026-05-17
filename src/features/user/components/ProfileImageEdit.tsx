/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useMe, useUploadImageProfile } from "../hooks/userHooks";
import { Icon } from "@iconify-icon/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip";

const ProfileImageEdit = () => {
  const { profile, user } = useMe();
  const [uploadKey, setUploadKey] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { mutate: updateImageProfile, isPending: isUpdatingProfileImage } =
    useUploadImageProfile();
  const initials = useMemo(() => {
    return user
      ? user.fullName
          .split(" ")
          .map((n, i) => (i < 2 ? n[0] : ""))
          .join("")
      : "";
  }, [user]);

  useEffect(() => {
    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileUpload = (nextFile: File | null) => {
    setFile(nextFile);
  };

  const resetUploadState = () => {
    setFile(null);
    setPreviewUrl(null);
    setUploadKey((prev) => prev + 1);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetUploadState();
    }
  };

  const avatarContent = profile?.avatarUrl ? (
    <div className="w-24 h-24 rounded-full overflow-hidden">
      <img
        src={profile.avatarUrl}
        alt="avatar image"
        className="w-full h-full object-cover object-center"
      />
    </div>
  ) : (
    <div className="w-24 h-24 rounded-full border-3 border-ring flex justify-center items-center bg-accent">
      <span className="font-bold text-accent-foreground text-[30px]">
        {initials}
      </span>
    </div>
  );

  return (
    <div className="w-fit flex flex-col items-center relative">
      {avatarContent}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setIsOpen(true)}
            className="cursor-pointer hover:bg-primary active:scale-95 absolute z-1 right-2.5 bottom-0 bg-ring rounded-full p-1.5 aspect-square flex justify-center items-center"
          >
            <Icon
              icon="akar-icons:pencil"
              width="1em"
              height="1em"
              style={{ color: "#FFFFFF" }}
            />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Ganti Foto Profil</p>
        </TooltipContent>
      </Tooltip>

      <Dialog
        open={isOpen}
        onOpenChange={handleOpenChange}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ganti Foto Profil</DialogTitle>
            <DialogDescription className="text-sm text-card-foreground">
              *Ukuran file maksimum adalah 5MB
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center">
            <div className="h-24 w-24 overflow-hidden rounded-full border border-border bg-muted">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="preview avatar"
                  className="h-full w-full object-cover object-center"
                />
              ) : profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt="current avatar"
                  className="h-full w-full object-cover object-center"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-lg font-bold text-muted-foreground">
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </div>

          <FileUpload
            key={uploadKey}
            onChange={handleFileUpload}
          />

          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => handleOpenChange(false)}
            >
              Batal
            </Button>
            <Button
              isLoading={isUpdatingProfileImage}
              disabled={!file || isUpdatingProfileImage}
              onClick={() => {
                if (!file) return;
                updateImageProfile(file, {
                  onSuccess: () => {
                    handleOpenChange(false);
                  },
                });
              }}
            >
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileImageEdit;
