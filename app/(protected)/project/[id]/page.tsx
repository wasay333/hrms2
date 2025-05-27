"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjectDetails } from "../../../../lib/queries/projectQueries";
import {
  useAddProjectEmployees,
  useRemoveProjectEmployees,
} from "../../../../lib/queries/userQueries";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../../components/ui/dropdown-menu";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import { Badge } from "../../../../components/ui/Badge";
import { useRemoveEmployeeMutation } from "../../../../lib/mutations/userMutations";
import type { User, UserProject } from "../../../../lib/types";
import { ProjectDetailsSkeleton } from "../../../../components/project-details-skeleton";

export default function ProjectDetailsPage() {
  const removeEmployeeMutation = useRemoveEmployeeMutation();
  const params = useParams();
  const projectId = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const {
    data: project,
    isLoading,
    error,
  } = useProjectDetails(projectId ?? "");

  const { data: availableEmployees, isLoading: availableEmployeesLoading } =
    useAddProjectEmployees(projectId ?? "");

  const { data: assignedEmployees, isLoading: assignedEmployeesLoading } =
    useRemoveProjectEmployees(projectId ?? "");

  const [addDropdownOpen, setAddDropdownOpen] = useState(false);
  const [removeDropdownOpen, setRemoveDropdownOpen] = useState(false);

  if (error)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">
          Error fetching project data
        </h1>
        <p className="text-gray-600">Please try again later</p>
      </div>
    );

  if (isLoading || availableEmployeesLoading || assignedEmployeesLoading)
    return <ProjectDetailsSkeleton />;

  if (!project)
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Project not found</h1>
      </div>
    );
  console.log("Available Employees:", availableEmployees);
  console.log("Assigned Employees:", assignedEmployees);
  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{project.name}</CardTitle>
          {project.detail && (
            <CardDescription className="text-base">
              {project.detail}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <span className="font-medium mr-2">Type:</span>
            <Badge variant="outline">{project.projectType || "N/A"}</Badge>
          </div>

          <div className="flex items-center">
            <span className="font-medium mr-2">Created:</span>
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            <span className="font-medium text-destructive mr-2 ml-2">
              Project Deadline:
            </span>

            <span>{new Date(project.mainDeadline).toLocaleDateString()}</span>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <div className="flex gap-2">
          <DropdownMenu
            open={addDropdownOpen}
            onOpenChange={setAddDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 cursor-pointer">
                <Plus className="h-4 w-4" />
                Add Employee
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
              {availableEmployees && availableEmployees.length > 0 ? (
                availableEmployees.map((employee: User) => (
                  <DropdownMenuItem
                    key={employee.id}
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/employeeInProject?projectId=${projectId}&userId=${employee.id}`
                      );
                    }}
                  >
                    <span>{employee.name || employee.email}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No available employees
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu
            open={removeDropdownOpen}
            onOpenChange={setRemoveDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 cursor-pointer">
                <Trash2 className="h-4 w-4" />
                Remove Employee
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px]">
              {assignedEmployees && assignedEmployees.length > 0 ? (
                assignedEmployees.map((employee: User) => (
                  <DropdownMenuItem
                    key={employee.id}
                    className="cursor-pointer text-destructive"
                    onClick={() =>
                      removeEmployeeMutation.mutate({
                        projectId: projectId ?? "",
                        userId: employee.id,
                      })
                    }
                  >
                    <span>{employee.name || employee.email}</span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No assigned employees
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {project.assignments.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No team members assigned to this project yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {project.assignments.map((assignment: UserProject) => (
            <Card key={assignment.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                  {/* Team member info column */}
                  <div className="bg-muted/30 p-6 md:border-r">
                    <div className="flex flex-col space-y-2">
                      <h3 className="text-xl font-bold">
                        {assignment.user.name || "Unknown"}
                      </h3>
                      <p className="text-sm font-medium text-primary">
                        {assignment.user.email || "No email"}
                      </p>
                      {assignment.user.position && (
                        <Badge variant="outline" className="w-fit mt-1">
                          {assignment.user.position}
                        </Badge>
                      )}
                      <div className="mt-2">
                        <Badge
                          variant={
                            assignment.status === "completed"
                              ? "default"
                              : assignment.status === "in_progress"
                                ? "secondary"
                                : "outline"
                          }
                          className="text-xs"
                        >
                          {assignment.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Work details column */}
                  <div className="p-6 md:col-span-3">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-primary">
                          Work Details
                        </h4>
                        <p className="mt-2 text-base">
                          {assignment.workDetail}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Assigned by
                          </p>
                          <p className="font-medium">
                            {assignment.admin.name || "Unknown"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Assigned at
                          </p>
                          <p>
                            {new Date(assignment.assignedAt).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">
                            Deadline
                          </p>
                          <p className="font-medium text-destructive">
                            {assignment.employeeDeadline
                              ? new Date(
                                  assignment.employeeDeadline
                                ).toLocaleDateString()
                              : "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
