"use client";

import { useSearchParams } from "next/navigation";
import { EmployeeInProjectForm } from "./employeeInProjectForm";

export function EmployeeInProjectFormWrapper() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const userId = searchParams.get("userId");

  if (!projectId || !userId) {
    return <div>Invalid URL parameters.</div>;
  }

  return <EmployeeInProjectForm projectId={projectId} userId={userId} />;
}
