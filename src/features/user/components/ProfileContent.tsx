import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useState } from "react";
import { useParams } from "react-router";
import type { JobAssignment, Review } from "@/shared/types/entity.type";
import type { WorkerProfile } from "../types";
import ProfileContentReviews from "./ProfileContentReviews";
import ProfileContentJobs from "./ProfileContentJobs";
import { useMeJobs } from "../hooks/clientHooks";
import { useMeAssignments } from "../hooks/workerHooks";
import {
  useMe,
  useMeReviews,
  useUserAssignments,
  useUserById,
  useUserJobs,
  useUserReviews,
} from "../hooks/userHooks";

type Tabs = "joblist" | "review";

const ProfileContent = () => {
  const [tabActive, setTabActive] = useState<Tabs>("joblist");
  const { userId } = useParams();
  const { user, profile } = useMe();
  const isOwnProfile = !userId || userId === user?.id;
  const {
    data: viewedUserData,
    isLoading: isViewedUserLoading,
    isError: isViewedUserError,
    error: viewedUserError,
  } = useUserById(userId || "", !isOwnProfile);
  const targetUser = isOwnProfile ? user : viewedUserData?.user;
  const targetProfile = isOwnProfile ? profile : viewedUserData?.profile;
  const targetRole = targetUser?.role;

  const [jobsPage, setJobsPage] = useState(1);
  const [jobsLimit, setJobsLimit] = useState(10);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsLimit, setReviewsLimit] = useState(10);

  const {
    data: clientData,
    isLoading: isLoadingJobs,
    isError: isClientJobsError,
    error: clientJobsError,
  } = useMeJobs({ page: jobsPage, limit: jobsLimit });
  const dataJobs = (clientData?.data ?? []) as JobAssignment[];

  const {
    data: workerData,
    isLoading: isLoadingAssignments,
    isError: isWorkerJobsError,
    error: workerJobsError,
  } = useMeAssignments(jobsPage, jobsLimit);
  const dataAssignments = (workerData?.data ?? []) as JobAssignment[];

  const {
    data: userJobsData,
    isLoading: isUserJobsLoading,
    isError: isUserJobsError,
    error: userJobsError,
  } = useUserJobs({
    userId: userId || "",
    page: jobsPage,
    limit: jobsLimit,
    enabled: !isOwnProfile && targetRole === "client",
  });
  const dataUserJobs = (userJobsData?.data ?? []) as JobAssignment[];

  const {
    data: userAssignmentsData,
    isLoading: isUserAssignmentsLoading,
    isError: isUserAssignmentsError,
    error: userAssignmentsError,
  } = useUserAssignments({
    userId: userId || "",
    page: jobsPage,
    limit: jobsLimit,
    enabled: !isOwnProfile && targetRole === "worker",
  });
  const dataUserAssignments = (userAssignmentsData?.data ??
    []) as JobAssignment[];

  const isClient = targetRole === "client";
  const jobsData = isClient
    ? isOwnProfile
      ? dataJobs
      : dataUserJobs
    : isOwnProfile
      ? dataAssignments
      : dataUserAssignments;
  const jobsLoading = isOwnProfile
    ? isClient
      ? isLoadingJobs
      : isLoadingAssignments
    : isViewedUserLoading ||
      (isClient ? isUserJobsLoading : isUserAssignmentsLoading);
  const jobsError = isOwnProfile
    ? isClient
      ? isClientJobsError
      : isWorkerJobsError
    : isViewedUserError ||
      (isClient ? isUserJobsError : isUserAssignmentsError);
  const jobsErrorMessage = isOwnProfile
    ? isClient
      ? clientJobsError instanceof Error
        ? clientJobsError.message
        : "Terjadi kesalahan saat memuat pekerjaan."
      : workerJobsError instanceof Error
        ? workerJobsError.message
        : "Terjadi kesalahan saat memuat pekerjaan."
    : viewedUserError instanceof Error
      ? viewedUserError.message
      : isClient
        ? userJobsError instanceof Error
          ? userJobsError.message
          : "Terjadi kesalahan saat memuat pekerjaan."
        : userAssignmentsError instanceof Error
          ? userAssignmentsError.message
          : "Terjadi kesalahan saat memuat pekerjaan.";
  const jobsTotalCount = isOwnProfile
    ? isClient
      ? clientData?.meta?.total
      : workerData?.meta?.total
    : isClient
      ? userJobsData?.meta?.total
      : userAssignmentsData?.meta?.total;
  const jobsEmptyMessage = isClient
    ? "Belum ada pekerjaan yang dibuat."
    : "Belum ada pekerjaan yang dikerjakan.";

  const {
    data: meReviewsData,
    isPending: isMeReviewsPending,
    isError: isMeReviewsError,
    error: meReviewsError,
  } = useMeReviews(reviewsPage, reviewsLimit);
  const userIdForReviews = isOwnProfile ? "" : userId || "";
  const {
    data: userReviewsData,
    isPending: isUserReviewsPending,
    isError: isUserReviewsError,
    error: userReviewsError,
  } = useUserReviews(userIdForReviews, reviewsPage, reviewsLimit);

  const reviewsData = ((isOwnProfile
    ? meReviewsData?.data
    : userReviewsData?.data) ?? []) as Review[];
  const workerProfile = targetProfile as WorkerProfile | null;
  const categoryRatings = workerProfile?.categoryRatings ?? [];
  const isWorker = targetUser?.role === "worker";
  const reviewsPending = isOwnProfile
    ? isMeReviewsPending
    : isViewedUserLoading || isUserReviewsPending;
  const reviewsError = isOwnProfile
    ? isMeReviewsError
    : isViewedUserError || isUserReviewsError;
  const reviewsErrorData = isOwnProfile
    ? meReviewsError
    : userReviewsError || viewedUserError;
  const reviewsTotalCount = isOwnProfile
    ? meReviewsData?.meta?.total
    : userReviewsData?.meta?.total;

  return (
    <div className="w-full h-fit bg-card flex flex-col items-center justify-center gap-5 p-6 shadow-md rounded-[14px]">
      {/* tabs */}
      <Tabs
        className="w-full"
        defaultValue="joblist"
        onValueChange={(value) => setTabActive(value as Tabs)}
        value={tabActive}
      >
        <TabsList
          className="w-full tracking-[1.2px] gap-2 sm:gap-3"
          variant="line"
        >
          <TabsTrigger value="joblist">LIST PEKERJAAN</TabsTrigger>
          <TabsTrigger value="review">ULASAN</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* mean ratings */}
      {tabActive === "joblist" ? (
        <ProfileContentJobs
          jobs={jobsData}
          isLoading={jobsLoading}
          isError={jobsError}
          errorMessage={jobsErrorMessage}
          totalCount={jobsTotalCount}
          emptyMessage={jobsEmptyMessage}
          page={jobsPage}
          limit={jobsLimit}
          onPageChange={setJobsPage}
          onPageSizeChange={(newLimit) => {
            setJobsLimit(newLimit);
            setJobsPage(1);
          }}
        />
      ) : (
        <ProfileContentReviews
          isWorker={isWorker}
          categoryRatings={categoryRatings}
          reviews={reviewsData}
          isPending={reviewsPending}
          isError={reviewsError}
          error={reviewsErrorData}
          totalCount={reviewsTotalCount}
          page={reviewsPage}
          limit={reviewsLimit}
          onPageChange={setReviewsPage}
          onPageSizeChange={(newLimit) => {
            setReviewsLimit(newLimit);
            setReviewsPage(1);
          }}
        />
      )}
    </div>
  );
};

export default ProfileContent;
