import { useAuthStore } from "@/features/auth/stores/authStores"
import JobFilter from "../components/JobFilter"
import JobOffer from "../components/JobOffer"
import MainListPostedJobs from "../components/MainListPostedJobs";

const JobPage = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <div className="w-full h-fit flex-col gap-4 sm:gap-6 sticky top-18.5 sm:top-20.5 hidden md:flex">
        <JobFilter />
        {isAuthenticated && <JobOffer />}
      </div>
      <MainListPostedJobs />
    </>
  )
}

export default JobPage