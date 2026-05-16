import Skeleton from '@/shared/components/Skeleton'

const JobOfferSkeleton = () => {
  return (
    <li className="w-full p-3 rounded-lg border border-border bg-background flex flex-col gap-3">
      
      {/* Title */}
      <Skeleton className="w-3/4 h-4" />

      {/* Status badge */}
      <Skeleton className="w-24 h-5 rounded-full" />
    </li>
  )
}

export default JobOfferSkeleton