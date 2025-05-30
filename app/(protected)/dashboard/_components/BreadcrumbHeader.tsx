// "use client";
// import { usePathname } from "next/navigation";
// import React from "react";
// import {
//   Breadcrumb,
//   BreadcrumbList,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbSeparator,
// } from "../../../../components/ui/breadcrumb";

// const BreadcrumbHeader = () => {
//   const pathname = usePathname();
//   const paths = pathname === "/" ? [""] : pathname?.split("/");
//   return (
//     <div className="flex items-center flex-start">
//       <Breadcrumb>
//         <BreadcrumbList>
//           {paths.map((path, index) => (
//             <React.Fragment key={index}>
//               <BreadcrumbItem>
//                 <BreadcrumbLink className="capitalize" href={`/${path}`}>
//                   {path === "" ? "home" : path}
//                 </BreadcrumbLink>
//               </BreadcrumbItem>
//               {index !== paths.length - 1 && <BreadcrumbSeparator />}
//             </React.Fragment>
//           ))}
//         </BreadcrumbList>
//       </Breadcrumb>
//     </div>
//   );
// };

// export default BreadcrumbHeader;
"use client";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../../../../components/ui/breadcrumb";

const BreadcrumbHeader = () => {
  const pathname = usePathname();
  const paths = pathname === "/" ? [""] : pathname?.split("/");

  return (
    <div className="flex items-center flex-start">
      <Breadcrumb>
        <BreadcrumbList>
          {paths.map((path, index) => {
            const isHome = path === "";
            const href = isHome
              ? "/dashboard"
              : `/${paths.slice(1, index + 1).join("/")}`;
            return (
              <React.Fragment key={index}>
                <BreadcrumbItem>
                  <BreadcrumbLink className="capitalize" href={href}>
                    {isHome ? "home" : path}
                  </BreadcrumbLink>
                </BreadcrumbItem>
                {index !== paths.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};

export default BreadcrumbHeader;
