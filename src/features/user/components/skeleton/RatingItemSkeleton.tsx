import Skeleton from "@/shared/components/Skeleton"

export const RatingItemSkeleton = () => {
  return (
    <li className="w-full p-3 flex items-center gap-3 border border-border shadow-md rounded-md">
      <div className="w-full flex items-center justify-between p-2">
        
        {/* Left section */}
        <div className="flex items-center gap-3">
          
          {/* Avatar */}
          <Skeleton className="w-10 h-10 rounded-full" />

          {/* Text */}
          <div className="flex flex-col gap-2">
            <Skeleton className="w-40 h-4" /> {/* Name */}
            <Skeleton className="w-28 h-3" /> {/* Badge */}
          </div>
        </div>

        {/* Arrow Icon */}
        <Skeleton className="w-6 h-6 rounded-md" />
      </div>
    </li>
  )
}