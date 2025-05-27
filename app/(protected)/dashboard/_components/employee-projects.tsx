import React from "react";
import Link from "next/link";
import { Skeleton } from "../../../../components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../components/ui/alert";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { AssignedProject } from "../../../../lib/types";

interface EmployeeProjectProps {
  data: AssignedProject[] | undefined;
  isLoading: boolean;
  error: unknown;
}

const EmployeeProjects = ({ data, isLoading, error }: EmployeeProjectProps) => {
  if (isLoading) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-center mb-4">
          Your Assigned Projects
        </h2>
        <ul className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <li
              key={i}
              className="flex justify-between items-center p-4 border rounded-xl shadow-sm bg-muted/40 animate-pulse"
            >
              <div className="flex flex-col gap-2 w-full">
                <Skeleton className="h-4 w-2/3 rounded-lg" />
                <Skeleton className="h-3 w-1/3 rounded-lg self-end" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="destructive"
        className="border-l-4 border-red-500 shadow-sm"
      >
        <div className="flex items-start gap-3">
          <ExclamationTriangleIcon className="h-5 w-5 mt-1 text-red-500" />
          <div>
            <AlertTitle className="text-base font-semibold">
              Failed to load projects
            </AlertTitle>
            <AlertDescription className="text-sm text-muted-foreground">
              Something went wrong while loading your assigned projects. Please
              try again later.
            </AlertDescription>
          </div>
        </div>
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-center mb-4">
        Your Assigned Projects
      </h2>

      {!data ||
      data.length === 0 ||
      data.every((project) => project.status === "completed") ? (
        <div className="flex justify-center items-center min-h-[120px]">
          <p className="text-sm text-muted-foreground text-center">
            {data &&
            data.length > 0 &&
            data.every((project) => project.status === "completed")
              ? "All your assigned projects have been completed."
              : "You don’t have any assigned projects at the moment."}
          </p>
        </div>
      ) : (
        <ul className="space-y-4">
          {data.map((project) => (
            <li
              key={project.projectId}
              className="flex justify-between items-center p-5 border rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 bg-card"
            >
              <Link
                href={`/employee-project/${project.projectId}`}
                className="text-primary font-medium hover:underline text-base"
              >
                {project.project.name}
              </Link>
              <span className="text-sm text-muted-foreground">
                Due:{" "}
                <span className="font-semibold text-destructive">
                  {new Date(project.employeeDeadline).toLocaleDateString()}
                </span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EmployeeProjects;
