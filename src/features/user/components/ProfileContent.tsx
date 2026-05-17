import { Tabs, TabsList, TabsTrigger } from "@/shared/components/ui/tabs";
import { useState } from "react";
import ProfileContentReviews from "./ProfileContentReviews";
import ProfileContentJobs from "./ProfileContentJobs";
import { useMe } from "../hooks/userHooks";

type Tabs = "joblist" | "review";

const ProfileContent = () => {
  const [tabActive, setTabActive] = useState<Tabs>("joblist");
  const { user, profile } = useMe();

  return (
    <div className="w-full h-fit bg-card flex flex-col items-center justify-center gap-5 p-6 shadow-md rounded-[14px] mb-4">
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
          sessionUser={user}
          sessionProfile={profile}
        />
      ) : (
        <ProfileContentReviews
          sessionUser={user}
          sessionProfile={profile}
        />
      )}
    </div>
  );
};

export default ProfileContent;
