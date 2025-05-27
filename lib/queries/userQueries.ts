import { useQuery } from "@tanstack/react-query";
import { Employee } from "../types";

export async function getClientCurrentUser() {
  const res = await fetch("/api/authenticatedUser", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}
export async function getAllEmployees() {
  const res = await fetch("/api/employees", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch employees");
  return res.json();
}
export async function getAllLeaves() {
  const res = await fetch("/api/allLeaves", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch all Leaves");
  return res.json();
}
export async function getAllLeavesOfLoggedInUser() {
  const res = await fetch("/api/leaves", {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user leaves");
  return res.json();
}
export async function getSingleLeaveOfLoggedInUser(leaveRequestId: string) {
  const res = await fetch(`/api/leave/${leaveRequestId}`, {
    method: "GET",
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch user leave");
  return res.json();
}
export async function getUserAttendance() {
  const res = await fetch("/api/attendence", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch user attendence");
  return res.json();
}

export const useAddProjectEmployees = (projectId: string) => {
  return useQuery({
    queryKey: ["projectAddEmployees", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/projectEmployeeAdd?projectId=${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch project add employees");
      return res.json();
    },
    enabled: !!projectId,
  });
};
export const useRemoveProjectEmployees = (projectId: string) => {
  return useQuery({
    queryKey: ["projectRemoveEmployees", projectId],
    queryFn: async () => {
      const res = await fetch(
        `/api/projectEmployeeRemove?projectId=${projectId}`
      );
      if (!res.ok) throw new Error("Failed to fetch project remove employees");
      return res.json();
    },
    enabled: !!projectId,
  });
};

async function fetchEmployee(id: string): Promise<Employee> {
  const res = await fetch(`/api/employee/${id}`);
  if (!res.ok) {
    throw new Error("Failed to fetch employee data");
  }
  return res.json();
}

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: ["employee", id],
    queryFn: () => fetchEmployee(id!),
    enabled: !!id,
  });
}
export async function getLeaveBalanceOfUser() {
  const res = await fetch("/api/leaveBalance", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch user leaveBalance");
  return res.json();
}
