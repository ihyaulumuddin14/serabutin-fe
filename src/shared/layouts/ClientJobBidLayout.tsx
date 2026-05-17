import { Outlet } from "react-router";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbSeparator,
// } from "@/shared/components/ui/breadcrumb";
// import { Link, useLocation } from "react-router";
import NavbarBack from "../components/NavbarBack";
import Container from "../components/Container";

const ClientJobBidLayout = () => {
  return (
    <div className="w-full min-dvh">
      <header>
        <NavbarBack />
      </header>

      <main className="w-full h-[calc(100dvh-58px)] flex justify-center bg-[#F6F3EF] mt-14.5">
        <Container>
          <div className="w-full gap-4 sm:gap-6">
            <Outlet />
          </div>
        </Container>
      </main>
    </div>
  );
};

export default ClientJobBidLayout;

// const JobBidBreadCrumbs = () => {
//   const location = useLocation();
//   const pathname = location.pathname;

//   const isJobBidsRoot = pathname.endsWith("/job-bids");
//   const hasJobId = pathname.includes("/job-bids/") && !isJobBidsRoot;

//   return (
//     <Breadcrumb>
//       <BreadcrumbList>
//         {isJobBidsRoot && (
//           <BreadcrumbItem key="job-bids">
//             <BreadcrumbLink asChild>
//               <Link to="/profile/job-bids">Pekerjaan</Link>
//             </BreadcrumbLink>
//           </BreadcrumbItem>
//         )}
//         {hasJobId && (
//           <>
//             <BreadcrumbItem key="job-bids">
//               <BreadcrumbLink asChild>
//                 <Link to="/profile/job-bids">Pekerjaan</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>
//             <BreadcrumbSeparator />
//             <BreadcrumbItem key="job-bids-detail">
//               <BreadcrumbLink asChild>
//                 <Link to="#">Daftar Penawaran</Link>
//               </BreadcrumbLink>
//             </BreadcrumbItem>
//           </>
//         )}
//       </BreadcrumbList>
//     </Breadcrumb>
//   );
// };
