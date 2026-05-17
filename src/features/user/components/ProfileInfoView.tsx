import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import type { Profile, User } from "@/shared/types/entity.type";
import { Icon } from "@iconify-icon/react";

export const ProfileInfoView = ({
  avatarContent,
  isOwnProfile,
  setIsEditing,
  user,
  profile,
}: {
  avatarContent: React.ReactNode;
  isOwnProfile: boolean;
  setIsEditing: (isEditing: boolean) => void;
  user?: User,
  profile?: Profile
}) => {
  return (
    <>
      {/* avatar */}
      {avatarContent}

      {/* identity */}
      <div className="flex flex-col items-center gap-0">
        <p className="text-lg font-extrabold">{user?.fullName}</p>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      {/* role badge */}
      <div className="flex w-full flex-wrap justify-center gap-2">
        {user?.role === "client" && (
          <Badge
            withDot
            variant="professional"
          >
            Klien
          </Badge>
        )}
        {user?.role === "worker" && (
          <Badge
            withDot
            variant="success"
          >
            Pekerja
          </Badge>
        )}
      </div>

      {/* address */}
      {profile?.locationCity && profile?.locationDistrict && (
        <div className="flex w-full rounded-md bg-muted border border-border p-3 gap-1 flex-col">
          <h3 className="text-muted-foreground text-[11px]">
            ALAMAT (KOTA & KECAMATAN)
          </h3>
          <p className="font-semibold text-foreground text-[13.5px]">
            {profile?.locationDistrict}, {profile?.locationCity}
          </p>
        </div>
      )}

      {/* stats */}
      <div className="flex w-full gap-2">
        {/* ratings */}
        <div className="w-full flex flex-col justify-center items-center gap-1 bg-card shadow-md p-3 rounded-md">
          <div className="flex gap-1 items-center">
            <Icon
              icon="radix-icons:star-filled"
              width="1.5em"
              height="2em"
              style={{ color: "#F97316" }}
            />
            <span className="text-[21px] font-semibold text-primary">
              {profile?.avgRating}
            </span>
          </div>
          <h3 className="text-muted-foreground text-[11px]">Rating Pengguna</h3>
        </div>
        {/* activity total */}
        <div className="w-full flex flex-col justify-center items-center gap-1 bg-card shadow-md p-3 rounded-md">
          <div className="flex gap-1 items-center">
            <span className="text-[21px] font-semibold text-primary">
              {user?.role === "client"
                ? profile?.totalJobsPosted
                : profile?.totalJobsCompleted}
            </span>
          </div>
          <h3 className="text-muted-foreground text-[11px]">
            {user?.role === "client" ? "Postingan" : "Pekerjaan Selesai"}
          </h3>
        </div>
      </div>

      {/* telephone number */}
      {profile?.phone && user?.role === "client" && isOwnProfile && (
        <div className="flex w-full rounded-md p-3 gap-2">
          <Icon
            icon="bi:telephone-fill"
            width="1.2em"
            height="1.2em"
            style={{ color: "#9A8F85" }}
          />
          <p className="text-foreground text-[13.5px]">{profile?.phone}</p>
        </div>
      )}

      {/* bio */}
      {profile?.bio && (
        <div className="flex w-full p-3 gap-1 flex-col">
          <h3 className="text-muted-foreground text-[11px]">BIO</h3>
          <p className="font-normal text-foreground text-[13.5px]">
            {profile?.bio}
          </p>
        </div>
      )}

      {isOwnProfile && (
        <Button
          variant={"ghost"}
          className="mt-3 text-primary font-semibold"
          onClick={() => setIsEditing(true)}
        >
          Edit Profile
        </Button>
      )}
    </>
  );
};