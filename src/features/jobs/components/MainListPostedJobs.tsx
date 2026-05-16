import { Button } from "@/shared/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/shared/components/ui/drawer";
import { useState } from "react";
import { useSearchParams } from "react-router";
import JobFilter from "./JobFilter";
import JobSearchFilter from "./JobSearchFilter";
import ListPostedJobs from "./ListPostedJobs";

const MainListPostedJobs = () => {
  const [searchParams] = useSearchParams();
  const [isOpenFilterDrawer, setIsOpenFilterDrawer] = useState(false);
  const q = searchParams.get("q") || undefined;
  const categorySlug = searchParams.get("category") || undefined;
  const city = searchParams.get("city") || undefined;
  const budgetMin = searchParams.get("budgetMin")
    ? parseInt(searchParams.get("budgetMin") as string)
    : undefined;
  const budgetMax = searchParams.get("budgetMax")
    ? parseInt(searchParams.get("budgetMax") as string)
    : undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;

  return (
    <>
      <div className="w-full h-fit flex flex-col gap-4 sm:gap-6">
        <h2 className="font-bold text-xl">Daftar Kebutuhan Jasa</h2>

        <nav className="w-full flex gap-2 sm:gap-5 justify-between items-center">
          <JobSearchFilter />

          <Drawer
            open={isOpenFilterDrawer}
            onOpenChange={setIsOpenFilterDrawer}
          >
            <DrawerTrigger asChild>
              <Button
                size={"lg"}
                variant={"outline"}
                className="bg-card text-muted-foreground font-bold!"
              >
                Filter
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <JobFilter
                setIsOpenFilterDrawer={setIsOpenFilterDrawer}
                className="pb-6!"
              />
            </DrawerContent>
          </Drawer>
        </nav>

        {/* list of posted jobs */}
        <ListPostedJobs
          categorySlug={categorySlug}
          city={city}
          budgetMin={budgetMin}
          budgetMax={budgetMax}
          dateFrom={dateFrom}
          dateTo={dateTo}
          q={q}
        />
      </div>
    </>
  );
};

export default MainListPostedJobs;
