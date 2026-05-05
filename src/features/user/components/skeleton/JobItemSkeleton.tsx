import Skeleton from "@/shared/components/Skeleton"

export const JobItemSkeleton = () => {
  return (
    <li className="p-3 sm:p-5 rounded-md flex flex-col gap-4 shadow-md border border-border">
      
      {/* Badge section */}
      <div className="w-full flex justify-between">
        <Skeleton className="w-24 h-5 rounded-full" />
        <Skeleton className="w-28 h-5 rounded-full" />
      </div>

      {/* Title */}
      <div className="flex flex-col gap-2">
        <Skeleton className="w-full h-4" />
        <Skeleton className="w-3/4 h-4" />
      </div>

      {/* Action buttons */}
      <div className="w-full flex justify-end gap-3">
        <Skeleton className="w-28 h-9 rounded-md" />
        <Skeleton className="w-20 h-9 rounded-md" />
      </div>
    </li>
  )
}