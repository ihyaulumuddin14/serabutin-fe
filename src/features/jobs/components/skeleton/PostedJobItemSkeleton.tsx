import Skeleton from "@/shared/components/Skeleton";

const PostedJobItemSkeleton = () => {
  return (
    <li className="w-full h-fit p-6 bg-card rounded-lg shadow-md flex flex-col gap-2">
      <div className="w-full flex justify-between items-center">
        <Skeleton className="w-24 h-5 rounded-full" />
        <Skeleton className="w-28 h-4" />
      </div>

      <Skeleton className="w-2/3 h-5" />

      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-5/6 h-4" />
      </div>

      <div className="w-full flex items-center gap-3 pb-3 border-b">
        <Skeleton className="w-40 h-4" />
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-36 h-6 rounded-md" />
      </div>

      <div className="w-full flex justify-between items-center">
        <Skeleton className="w-48 h-4" />
        <Skeleton className="w-20 h-8 rounded-md" />
      </div>
    </li>
  );
};

export default PostedJobItemSkeleton;
