import { useLogout } from "@/features/auth/hooks/authHooks";
import { BidList } from "@/features/jobs/components/JobOffer";
import { useMe } from "@/features/user/hooks/userHooks";
import { useMeBids } from "@/features/user/hooks/workerHooks";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/shared/components/ui/navigation-menu";
import { BriefcaseBusiness } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router";
import Skeleton from "./Skeleton";
import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { PaginationWithLinks } from "./ui/pagination-with-links";
import { Separator } from "./ui/separator";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const NavbarMain = () => {
  const { user, isPending } = useMe();
  const navigate = useNavigate();

  const handleClientJobBidsNavigate = () => {
    navigate("/job-bids");
  };

  return (
    <nav className="fixed z-50 top-0 left-0 w-full h-14.5 px-4 sm:px-8 flex items-center justify-between bg-white">
      {/* logo */}
      <Link
        to="/"
        className="flex gap-3 items-center"
      >
        <img
          src="/logo.webp"
          alt="logo"
        />
        <h1 className="text-xl sm:text-[26px] font-inter font-bold">
          Serabutin
        </h1>
      </Link>

      {/* profile or auth button */}
      {isPending ? (
        <Skeleton />
      ) : user ? (
        <div className="flex gap-2 font-plus items-center">
          <p className="hidden md:block">
            Halo, {user.fullName.split(" ")[0]}👋
          </p>
          {user?.role === "worker" ? (
            <BidsDrawer />
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  className="w-8.5 h-8.5 rounded-full flex justify-center items-center overflow-hidden md:hidden bg-accent border-2 border-ring hover:cursor-pointer"
                  onClick={handleClientJobBidsNavigate}
                >
                  <BriefcaseBusiness
                    color="#C95E07"
                    size={16}
                    className=""
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-sm">Lihat Penawaran</p>
              </TooltipContent>
            </Tooltip>
          )}
          <ProfileDropdown />
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            className="hidden sm:inline-flex"
            onClick={() => navigate("/register")}
          >
            Registrasi
          </Button>
          <Button
            variant={"secondary"}
            onClick={() => navigate("/login")}
          >
            Masuk
          </Button>
        </div>
      )}
    </nav>
  );
};

export default NavbarMain;

const ProfileDropdown = () => {
  const navigate = useNavigate();
  const { mutate: logoutMutate, isPending: isLogoutPending } = useLogout();
  const { user, profile } = useMe();
  const initials = useMemo(() => {
    return user
      ? user.fullName
          .split(" ")
          .map((n, i) => (i < 2 ? n[0] : ""))
          .join("")
      : "";
  }, [user]);

  const avatarContent = profile?.avatarUrl ? (
    <div className="w-8.5 h-8.5 rounded-full overflow-hidden">
      <img
        src={profile.avatarUrl}
        alt="avatar image"
        className="w-full h-full object-cover object-center"
      />
    </div>
  ) : (
    <div className="w-8.5 h-8.5 rounded-full border-2 border-ring flex justify-center items-center bg-accent">
      <span className="font-bold text-accent-foreground text-[13px]">
        {initials}
      </span>
    </div>
  );

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            buttonable={false}
            withoutIndicator
          >
            {avatarContent}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-full min-w-62.5">
            <div
              onClick={() => navigate("/profile")}
              className="cursor-pointer w-full max-w-62.5 flex flex-col items-center justify-center gap-2 p-4"
            >
              {avatarContent}
              <p className="text-sm font-medium">{user?.fullName}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <NavigationMenuLink
              href="/profile"
              onClick={(event) => {
                event.preventDefault();
                navigate("/profile");
              }}
              className="w-full"
            >
              Profil
            </NavigationMenuLink>
            <Separator className="inset-0" />
            <NavigationMenuLink
              onClick={() => logoutMutate()}
              className="w-full text-center cursor-pointer hover:text-destructive"
            >
              {isLogoutPending ? "Keluar..." : "Keluar"}
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export const BidsDrawer = ({
  triggerOption = "icon",
}: {
  triggerOption?: "icon" | "text";
}) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useMeBids({ page, limit, enabled: isOpen });

  return (
    <Drawer
      open={isOpen}
      onOpenChange={setIsOpen}
      direction="right"
    >
      <DrawerTrigger>
        {triggerOption === "text" ? (
          <p className="text-primary hover:underline mt-5 text-center">
            Lihat Selengkapnya
          </p>
        ) : (
          <div className="w-8.5 h-8.5 rounded-full flex justify-center items-center overflow-hidden md:hidden bg-accent border-2 border-ring">
            <BriefcaseBusiness
              color="#C95E07"
              size={16}
              className=""
            />
          </div>
        )}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle asChild>
            <h2 className="font-bold text-xl">Daftar Penawaran Saya</h2>
          </DrawerTitle>
        </DrawerHeader>
        <div className="w-full h-full bg-card flex flex-col gap-3 justify-between p-4 sm:p-6 overflow-y-scroll">
          <BidList enabledBidsFetch={isOpen} page={page} limit={limit} />
          <PaginationWithLinks
            page={page}
            pageSize={limit}
            totalCount={data?.meta?.total ?? 0}
            onPageChange={setPage}
            onPageSizeChange={(newLimit) => {
              setLimit(newLimit);
              setPage(1);
            }}
          />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Tutup</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};
