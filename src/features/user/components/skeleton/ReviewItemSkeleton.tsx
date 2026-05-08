import Skeleton from "@/shared/components/Skeleton"
import { useIsMobile } from "@/shared/hooks/useAnimation"

const ReviewItemSkeleton = () => {
  const isMobile = useIsMobile()

  return (
    <li className="px-3 py-2 rounded-md flex items-center gap-1 sm:gap-3 bg-muted border border-border">
      
      {/* Avatar (desktop) */}
      {!isMobile && (
        <Skeleton className="w-9 h-9 rounded-full" />
      )}

      <div className="w-fit flex flex-col gap-2 flex-1">
        
        {/* Header */}
        <div className="flex gap-2 items-center">
          
          {/* Avatar (mobile) */}
          {isMobile && (
            <Skeleton className="w-9 h-9 rounded-full" />
          )}

          {/* Name */}
          <Skeleton className="w-32 h-3" />
        </div>

        {/* Comment */}
        <Skeleton className="w-52 h-3" />
        <Skeleton className="w-40 h-3" />

        {/* Rating */}
        <div className="flex gap-2 items-center">
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-3 h-3 rounded-sm" />
            ))}
          </div>
          <Skeleton className="w-6 h-3" />
        </div>
      </div>

      {/* Badge */}
      <Skeleton className="w-16 h-6 rounded-md ml-auto" />
    </li>
  )
}

export default ReviewItemSkeleton