import { useLogout } from '@/features/auth/hooks/authHooks';
import { useMe } from "@/features/user/hooks/userHooks";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from '@/shared/components/ui/navigation-menu';
import { useMemo } from "react";
import { Link, useNavigate } from "react-router";
import Skeleton from "./Skeleton";
import { Button } from "./ui/button";
import { Separator } from './ui/separator';

const NavbarMain = () => {
  const { user, isPending } = useMe();
  const navigate = useNavigate();

  return (
    <nav className="fixed z-50 top-0 left-0 w-full h-14.5 px-4 sm:px-8 flex items-center justify-between bg-white">
      {/* logo */}
      <Link to="/" className="flex gap-3 items-center">
        <img src="/logo.webp" alt="logo" />
        <h1 className="text-xl sm:text-[26px] tracking-[3.64px] font-inter font-bold">SERABUTIN</h1>
      </Link>

      {/* profile or auth button */}
      {isPending ? <Skeleton /> : user ? (
        <div className="flex gap-2 font-plus items-center">
          <p>Halo, {user.fullName.split(" ")[0]}👋</p>
          <ProfileDropdown />
        </div>
      ) : (
        <div className="flex gap-2">
          <Button onClick={() => navigate("/register")}>Registrasi</Button>
          <Button variant={"secondary"} onClick={() => navigate("/login")}>Masuk</Button>
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
    return user ? user.fullName.split(" ").map((n) => n[0]).join("") : "";
  }, [user])

  const avatarContent = profile?.avatarUrl ? (
    <div className='w-8.5 h-8.5 rounded-full overflow-hidden'>
      <img src={profile.avatarUrl} alt="avatar image" className='w-full h-full object-cover object-center'/>
    </div>
  ) : (
    <div className="w-8.5 h-8.5 rounded-full border-2 border-ring flex justify-center items-center bg-accent">
      <span className="font-bold text-accent-foreground text-[13px]">{initials}</span>
    </div>
  )

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger onClick={() => navigate("/profile")} buttonable={false} withoutIndicator>
            {avatarContent}
          </NavigationMenuTrigger>
          <NavigationMenuContent className="w-full min-w-62.5">
            <div onClick={() => navigate("/profile")} className='cursor-pointer w-full max-w-62.5 flex flex-col items-center justify-center gap-2 p-4'>
              {avatarContent}
              <p className='text-sm font-medium'>{user?.fullName}</p>
              <p className='text-xs text-muted-foreground'>{user?.email}</p>
            </div>
            <Separator className="inset-0" />
            <NavigationMenuLink onClick={() => logoutMutate()} className="w-full text-center cursor-pointer hover:text-destructive">
              {isLogoutPending ? "Keluar..." : "Keluar"}
            </NavigationMenuLink>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}