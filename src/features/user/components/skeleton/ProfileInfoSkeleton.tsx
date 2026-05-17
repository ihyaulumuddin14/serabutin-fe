import Skeleton from "@/shared/components/Skeleton";

const ProfileInfoSkeleton = () => {
  return (
    <div className="w-full h-fit bg-card flex flex-col items-center justify-center gap-4 p-4 sm:p-6 shadow-md rounded-[14px]">
      <Skeleton className="w-24 h-24 rounded-full" />
      <div className="flex flex-col items-center gap-2 w-full">
        <Skeleton className="w-40 h-4" />
        <Skeleton className="w-52 h-3" />
      </div>
      <div className="flex w-full justify-center gap-2">
        <Skeleton className="w-20 h-5 rounded-full" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <div className="flex w-full gap-2">
        <Skeleton className="flex-1 h-18 rounded-md" />
        <Skeleton className="flex-1 h-18 rounded-md" />
      </div>
    </div>
  );
};

export default ProfileInfoSkeleton;
