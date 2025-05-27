"use client";

import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Skeleton } from "../../../../components/ui/skeleton";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useCurrentUserProjectDetails } from "../../../../lib/queries/projectQueries";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
} from "../../../../components/ui/select";
import { useUpdateProjectStatus } from "../../../../lib/mutations/projectMutations";
import { ProjectStatus } from "@prisma/client";

interface Assignment {
  id: string;
  user: { name: string } | null;
  admin: { name: string } | null;
  employeeDeadline: string;
  assignedAt: string;
  status: ProjectStatus;
}

const statusOptions = ["in_progress", "completed"];

const ProjectDetailsPage = () => {
  const params = useParams();
  const projectId = params?.id as string;

  const { data, isLoading, isError } = useCurrentUserProjectDetails(projectId);
  const { mutate, isPending } = useUpdateProjectStatus();

  if (isLoading) {
    return (
      <Card className="p-6 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-5 w-1/2" />
        {[...Array(2)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
        ))}
      </Card>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to load project details. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{data?.name || "Project Name"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">Project ID:</span> {projectId}
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Assignments</h3>
          {data?.assignments?.length > 0 ? (
            data.assignments.map((assignment: Assignment, index: number) => (
              <div
                key={index}
                className="border p-4 rounded-lg space-y-2 shadow-sm"
              >
                <p>
                  <strong>Assigned To:</strong> {assignment.user?.name || "N/A"}
                </p>
                <p>
                  <strong>Assigned By:</strong>{" "}
                  {assignment.admin?.name || "N/A"}
                </p>
                <p>
                  <strong>Deadline:</strong>{" "}
                  {new Date(assignment.employeeDeadline).toLocaleDateString()}
                </p>
                <p>
                  <strong>Assigned At:</strong>{" "}
                  {new Date(assignment.assignedAt).toLocaleString()}
                </p>

                <div className="pt-2">
                  <Select
                    defaultValue={assignment.status}
                    onValueChange={(value) =>
                      mutate({
                        projectId,
                        status: value as ProjectStatus,
                      })
                    }
                    disabled={isPending}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Status</SelectLabel>
                        {statusOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option.charAt(0).toUpperCase() + option.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))
          ) : (
            <p>No assignments available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetailsPage;
