"use client";

import type * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from "../../../../components/ui/sidebar";
import { ModeToggle } from "./mode-toggle";
import { Command } from "lucide-react";
import { UserData } from "./UserDate";
import {
  getAllEmployees,
  getClientCurrentUser,
} from "../../../../lib/queries/userQueries";
import { useQuery } from "@tanstack/react-query";
import { Employees } from "./Employees";
import { getAllProjects } from "../../../../lib/queries/projectQueries";
import { Projects } from "./Projects";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import { Skeleton } from "../../../../components/ui/skeleton";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getClientCurrentUser,
  });
  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: getAllProjects,
    enabled: !!data && data.role === "ADMIN",
  });
  const {
    data: employees,
    isLoading: employeesLoading,
    error: employeesError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
    enabled: !!data && data.role === "ADMIN",
  });
  const { state } = useSidebar();

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-3 bg-primary/10 rounded-md group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-md">
            <Command className="w-4 h-4" />
          </div>
          <h1 className="text-lg font-bold text-primary tracking-wide group-data-[collapsible=icon]:hidden">
            KodSphere
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <UserData data={data} error={error} isLoading={isLoading} />
        {data?.role === "ADMIN" && (
          <>
            <Projects
              data={projects}
              isLoading={projectsLoading}
              error={projectsError}
              isCollapsed={isCollapsed}
            />
            <Employees
              data={employees}
              isLoading={employeesLoading}
              error={employeesError}
              isCollapsed={isCollapsed}
            />
          </>
        )}
        {!isCollapsed ? (
          <div className="flex justify-center items-center my-1">
            {isLoading ? (
              <Skeleton className="h-10 w-[180px] rounded-md" />
            ) : (
              <>
                <Link href="/ownAttendence">
                  <Button variant="default" className="mx-5 cursor-pointer">
                    Check your attendance
                  </Button>
                </Link>
              </>
            )}
          </div>
        ) : (
          <></>
        )}
        {!isCollapsed && (isLoading || data?.role === "EMPLOYEE") && (
          <div className="flex flex-col justify-center items-center space-y-2 mt-2">
            {isLoading ? (
              <Skeleton className="h-10 w-[180px] rounded-md" />
            ) : (
              <Link href="/leaves">
                <Button variant="default" className="mx-5">
                  Leaves status
                </Button>
              </Link>
            )}
          </div>
        )}
        {!isCollapsed && data?.role === "ADMIN" && (
          <div className="flex flex-col justify-center items-center gap-y-4 my-1">
            <Link href={"/allLeaves"}>
              <Button variant="default" className="mx-5 cursor-pointer">
                Check Leave Requests
              </Button>
            </Link>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center justify-between w-full px-3 py-2 group-data-[collapsible=icon]:justify-center">
          <span className="text-sm text-muted-foreground group-data-[collapsible=icon]:hidden">
            Theme
          </span>
          <div className="-mt-1">
            <ModeToggle />
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
