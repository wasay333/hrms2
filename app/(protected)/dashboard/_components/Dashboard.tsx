"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getAllEmployees,
  getAllLeaves,
  getAllLeavesOfLoggedInUser,
  getClientCurrentUser,
  getLeaveBalanceOfUser,
} from "../../../../lib/queries/userQueries";
import { Skeleton } from "../../../../components/ui/skeleton"; // Adjust this path based on your component structure
import { DashboardCard } from "../../../../components/dashboard-card";
import { DashboardSection } from "../../../../components/dashboard-section";
import { ProjectChart } from "../../../../components/project-chart";
import { LeaveChart } from "../../../../components/leave-chart";
import { EmployeeChart } from "../../../../components/employee-chart";
import {
  getAllProjects,
  getEmployeesProjects,
} from "../../../../lib/queries/projectQueries";
import { LeaveLeft } from "../../../../components/leave-left";
import EmployeeProjects from "./employee-projects";
import { TimeLogForm } from "../../../../components/timeLogForm";
import { TodayWorkForm } from "../../../../components/today-work-form";
import TimeLogsTable from "../../../../components/timeLogTable";
import TaskListing from "../../../../components/tasks";
import { useSessionCacheManager } from "../../../../hooks/session-cache-manager";

export default function DashboardPage() {
  useSessionCacheManager();
  const { data, isLoading, error } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getClientCurrentUser,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
  const userId = data?.id;

  const {
    data: projects,
    isLoading: projectsLoading,
    error: projectsError,
  } = useQuery({
    queryKey: ["projects", userId],
    queryFn: getAllProjects,
    enabled: !!data && data.role === "ADMIN",
    staleTime: 0,
  });
  const {
    data: employees,
    isLoading: employeesLoading,
    error: employeesError,
  } = useQuery({
    queryKey: ["employees", userId],
    queryFn: getAllEmployees,
    enabled: !!data && data.role === "ADMIN",
    staleTime: 0,
  });

  const {
    data: leaves,
    isLoading: leavesLoading,
    error: leavesError,
  } = useQuery({
    queryKey: ["leaves", userId],
    queryFn: getAllLeaves,
    enabled: !!data && data.role === "ADMIN",
    staleTime: 0,
  });

  const {
    data: myLeaves,
    isLoading: myLeavesLoading,
    error: myLeavesError,
  } = useQuery({
    queryKey: ["myLeaves", userId],
    queryFn: getAllLeavesOfLoggedInUser,
    staleTime: 0,
  });

  const {
    data: myBalance,
    isLoading: myBalanceLoading,
    error: myBalanceError,
  } = useQuery({
    queryKey: ["myBalance", userId], // Add userId to key
    queryFn: getLeaveBalanceOfUser,
    enabled: !!data && data.role === "EMPLOYEE",
    staleTime: 0,
  });

  const {
    data: employeeProjects,
    isLoading: employeeProjectsLoading,
    error: employeeProjectsError,
  } = useQuery({
    queryKey: ["employeeProjects", userId], // Add userId to key
    queryFn: getEmployeesProjects,
    staleTime: 0,
  });
  if (isLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          {[...Array(3)].map((_, idx) => (
            <Skeleton
              key={idx}
              className="aspect-video rounded-xl bg-muted/50"
            />
          ))}
        </div>
        <Skeleton className="min-h-[50vh] flex-1 rounded-xl bg-muted/50" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-4">
        <div className="text-center text-destructive text-sm font-medium">
          Failed to load dashboard data. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <>
      {data?.role === "ADMIN" && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <DashboardCard>
              <EmployeeChart
                data={employees}
                isLoading={employeesLoading}
                error={employeesError}
              />
            </DashboardCard>
            <DashboardCard>
              <LeaveChart
                data={leaves}
                isLoading={leavesLoading}
                error={leavesError}
              />
            </DashboardCard>
            <DashboardCard>
              <ProjectChart
                data={projects}
                isLoading={projectsLoading}
                error={projectsError}
              />
            </DashboardCard>
          </div>
          <div className="grid grid-cols-3 gap-4 w-full">
            <div className="col-span-2">
              <TimeLogsTable />
            </div>
            <div className="min-h-[300px] rounded-xl border border-dashed border-muted flex items-center justify-center text-muted-foreground">
              <TaskListing />
            </div>
          </div>
        </div>
      )}

      {data?.role === "EMPLOYEE" && (
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <DashboardCard>
              <EmployeeProjects
                data={employeeProjects}
                isLoading={employeeProjectsLoading}
                error={employeeProjectsError}
              />
            </DashboardCard>
            <DashboardCard>
              <LeaveChart
                data={myLeaves}
                isLoading={myLeavesLoading}
                error={myLeavesError}
              />
            </DashboardCard>
            <DashboardCard>
              <LeaveLeft
                data={myBalance}
                isLoading={myBalanceLoading}
                error={myBalanceError}
              />
            </DashboardCard>
          </div>
          <DashboardSection layout="horizontal">
            <TimeLogForm
              data={employeeProjects}
              isLoading={employeeProjectsLoading}
              error={employeeProjectsError}
            />
            <TodayWorkForm />
          </DashboardSection>
        </div>
      )}
    </>
  );
}
