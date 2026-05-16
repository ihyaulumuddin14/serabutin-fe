import { useMemo, useState } from "react";
import { useMe } from "../hooks/userHooks";
import { useParams } from "react-router";
import { ProfileInfoView } from "./ProfileInfoView";
import { ProfileInfoEdit } from "./ProfileInfoEdit";
import ProfileInfoSkeleton from "./skeleton/ProfileInfoSkeleton";

const ProfileInfo = () => {
  const { userId } = useParams();
  const { user, profile, isLoading, isError, error } = useMe();
  const initials = useMemo(() => {
    return user
      ? user.fullName
          .split(" ")
          .map((n, i) => (i < 2 ? n[0] : ""))
          .join("")
      : "";
  }, [user]);
  const isOwnProfile = !userId || userId === user?.id;
  const [isEditing, setIsEditing] = useState(false);

  if (isLoading) {
    return <ProfileInfoSkeleton />;
  }

  if (isError) {
    return (
      <div className="w-full h-fit bg-card flex items-center justify-center p-4 sm:p-6 shadow-md rounded-[14px]">
        <p className="text-sm text-destructive">
          {error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memuat profil."}
        </p>
      </div>
    );
  }

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
    <div className="w-full h-fit bg-card flex flex-col items-center justify-center gap-2 p-4 sm:p-6 shadow-md rounded-[14px]">
      {isEditing ? (
        <ProfileInfoEdit setIsEditing={setIsEditing} />
      ) : (
        <ProfileInfoView
          setIsEditing={setIsEditing}
          avatarContent={avatarContent}
          isOwnProfile={isOwnProfile}
        />
      )}
    </div>
  );
};

export default ProfileInfo;
