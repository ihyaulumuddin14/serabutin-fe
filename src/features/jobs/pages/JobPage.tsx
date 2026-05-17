import { useAuthStore } from "@/features/auth/stores/authStores"
import JobFilter from "../components/JobFilter"
import JobOffer from "../components/JobOffer"
import MainListPostedJobs from "../components/MainListPostedJobs";
import { useMe } from "@/features/user/hooks/userHooks";
import { Button } from "@/shared/components/ui/button";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router";

const JobPage = () => {
  const { isAuthenticated } = useAuthStore();
  const { user } = useMe();
  const navigate = useNavigate();
  const handlePostJob = () => {
    navigate("/job-post");
  }

  return (
    <>
      <div className="w-full h-fit flex-col gap-4 sm:gap-6 sticky top-18.5 sm:top-20.5 hidden md:flex">
        <JobFilter />
        {isAuthenticated && <JobOffer />}
      </div>
      <MainListPostedJobs />
      {user?.role === "client" && (
        <Button size={"xl"} className="fixed bottom-7 right-7 flex gap-2 md:hidden text-sm!" onClick={handlePostJob}>
          <Plus strokeWidth={3} className="size-7"/>
          Posting
        </Button>
      )}
    </>
  )
}

export default JobPage