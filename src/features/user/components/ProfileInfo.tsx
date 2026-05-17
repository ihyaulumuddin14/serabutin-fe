import { useMemo, useState } from "react";
import { useMe, useUserById } from "../hooks/userHooks";
import { useParams } from "react-router";
import { ProfileInfoView } from "./ProfileInfoView";
import { ProfileInfoEdit } from "./ProfileInfoEdit";
import ProfileInfoSkeleton from "./skeleton/ProfileInfoSkeleton";
import type { Profile, User } from "@/shared/types/entity.type";

const ProfileInfo = () => {
  const { userId } = useParams();
  const { user, profile, isLoading } = useMe();
  const { data } = useUserById(userId || user?.id || "")
  const isOwnProfile = !userId || userId === user?.id;
  const [isEditing, setIsEditing] = useState(false);

  const finalProfile = isOwnProfile ? profile : data?.profile;
  const finalUser = isOwnProfile ? user : data?.user;
  const initials = useMemo(() => {
    return finalUser
    ? finalUser.fullName
    .split(" ")
    .map((n, i) => (i < 2 ? n[0] : ""))
    .join("")
    : "";
  }, [finalUser]);

  if (isLoading) {
    return <ProfileInfoSkeleton />;
  }

  const avatarContent = (finalProfile && "avatarUrl" in finalProfile && finalProfile.avatarUrl) ? (
    <div className="w-24 h-24 rounded-full overflow-hidden">
      <img
        src={finalProfile.avatarUrl}
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
          user={finalUser as User}
          profile={finalProfile as Profile}
        />
      )}
    </div>
  );
};

export default ProfileInfo;
