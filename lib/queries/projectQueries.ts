import { useQuery } from "@tanstack/react-query";
export async function getAllProjects() {
  const res = await fetch("/api/projects", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
}

export const useProjectDetails = (projectId: string) => {
  return useQuery({
    queryKey: ["projectDetails", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/project/${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch project details");
      return res.json();
    },
    enabled: !!projectId,
  });
};

export const useCurrentUserProjectDetails = (projectId: string) => {
  return useQuery({
    queryKey: ["projectDetails", projectId],
    queryFn: async () => {
      const res = await fetch(`/api/currentUserProject/${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch user project details");
      return res.json();
    },
    enabled: !!projectId,
  });
};
export async function getEmployeesProjects() {
  const res = await fetch("/api/employeeProjects", {
    method: "GET",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to employee projects");
  return res.json();
}
