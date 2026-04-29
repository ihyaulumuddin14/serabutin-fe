import { cn } from "../lib/utils"

const Skeleton = ({
  className
}: {
  className?: string
}) => {
  return (
    <div className={cn("animate-pulse bg-muted-foreground w-25 h-9.25 rounded-md", className)}></div>
  )
}

export default Skeleton