import { Badge } from "@/shared/components/ui/badge";
import { PaginationWithLinks } from "@/shared/components/ui/pagination-with-links";
import type { Review } from "@/shared/types/entity.type";
import { Icon } from "@iconify-icon/react";
import { useState } from "react";
import { useMe, useMeReviews } from "../hooks/userHooks";
import type { WorkerProfile } from "../types";
import { useIsMobile } from "@/shared/hooks/useAnimation";
import ReviewItemSkeleton from "./skeleton/ReviewItemSkeleton";

const ProfileContentReviews = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isPending: isReviewsPending } = useMeReviews(page, limit);
  const { user, profile } = useMe();
  const dataReviews = (data?.data ?? []) as Review[];
  const workerProfile = profile as WorkerProfile | null;
  const categoryRatings = workerProfile?.categoryRatings ?? [];

  return (
    <>
      {user?.role === "worker" && categoryRatings.length > 0 && (
        <div className="w-full overflow-x-auto snap-mandatory snap-x scroll-smooth">
          <ul className="min-w-fit flex gap-4 items-start justify-start py-1 snap-">
            {categoryRatings.map((item) => (
              <RatingCategoryItem
                key={item.categoryId}
                category={item.categoryName}
                rating={item.avgRating}
              />
            ))}
          </ul>
        </div>
      )}

      {/* review list */}
      <div className="w-full flex flex-col gap-2">
        {isReviewsPending ? (
          [...Array(2)].map((_, i) => <ReviewItemSkeleton key={i} />)
        ) : dataReviews.length > 0 ? (
          dataReviews.map((item) => {
            const initials = item.reviewer.fullName
              .split(" ")
              .map((n: string) => n[0])
              .join("");

            return (
              <ReviewItem
                key={item.id}
                review={item}
                initials={initials}
              />
            );
          })
        ) : (
          <p className="text-center text-sm text-muted-foreground">
            Belum ada ulasan yang diterima.
          </p>
        )}
      </div>

      {!!data?.meta?.total && (
        <PaginationWithLinks
          page={page}
          pageSize={limit}
          totalCount={data.meta.total}
          onPageChange={setPage}
          onPageSizeChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      )}
    </>
  );
};

export default ProfileContentReviews;

const RatingCategoryItem = ({
  category,
  rating,
}: {
  category: string;
  rating: number;
}) => {
  return (
    <li
      key={category}
      className="w-fit p-3 rounded-md shadow-md flex flex-col gap-1 items-center snap-start"
    >
      <h3 className="text-xs sm:text-sm whitespace-nowrap">{category}</h3>
      <p className="text-xl sm:text-2xl text-primary font-bold">
        {rating.toFixed(1)}
      </p>
      <span className="text-xs sm:text-sm text-muted-foreground">dari 5.0</span>
    </li>
  );
};

const ReviewItem = ({
  review,
  initials,
}: {
  review: Review;
  initials: string;
}) => {
  const isMobile = useIsMobile();

  return (
    <li
      key={review.id}
      className="px-3 py-2 rounded-md flex items-center gap-1 sm:gap-3 bg-muted border border-border"
    >
      {!isMobile && (
        <div className="w-9 h-9 rounded-full border-2 border-ring flex justify-center items-center bg-accent">
          <span className="font-bold text-accent-foreground text-[13px]">
            {initials}
          </span>
        </div>
      )}

      <div className="w-fit flex flex-col gap-1">
        <div className="flex gap-2 items-center">
          {isMobile && (
            <div className="w-9 h-9 rounded-full border-2 border-ring flex justify-center items-center bg-accent">
              <span className="font-bold text-accent-foreground text-[13px]">
                {initials}
              </span>
            </div>
          )}
          <h3 className="font-bold text-[13px]">{review.reviewer.fullName}</h3>
        </div>
        <p className="text-sm text-[11.5px]">{review.comment}</p>
        <div className="flex gap-2">
          <div className="flex gap-0.5 items-center">
            {[...Array(5)].map((_, i) => {
              if (i >= review.rating) {
                return (
                  <Icon
                    key={i}
                    icon="radix-icons:star-filled"
                    width=".6em"
                    height=".6em"
                    style={{ color: "#9A8F85" }}
                  />
                );
              }

              return (
                <Icon
                  key={i}
                  icon="radix-icons:star-filled"
                  width=".6em"
                  height=".6em"
                  style={{ color: "#F97316" }}
                />
              );
            })}
          </div>
          <span className="text-sm text-[10px] font-medium text-muted-foreground">
            {review.rating}
          </span>
        </div>
      </div>

      <Badge className="ml-auto">Category</Badge>
    </li>
  );
};
