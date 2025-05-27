"use client";

import { useParams } from "next/navigation";
import { useEmployee } from "../../../../lib/queries/userQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/Badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import {
  CalendarDays,
  Briefcase,
  Mail,
  Phone,
  User,
  Clock,
} from "lucide-react";
import { Skeleton } from "../../../../components/ui/skeleton";
import { cn } from "../../../../lib/utils";

export default function EmployeePage() {
  const params = useParams();

  // Handle possible string[] or undefined type for id param
  const employeeId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const { data: employee, error, isLoading } = useEmployee(employeeId);

  if (error)
    return (
      <div className="container mx-auto py-10 px-4">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Error loading employee data: {(error as Error).message}</p>
          </CardContent>
        </Card>
      </div>
    );

  return (
    <div className="container mx-auto py-10 px-4">
      {isLoading ? (
        <EmployeeDetailsSkeleton />
      ) : employee ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="md:col-span-1">
              <CardHeader className="text-center pb-2">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    {employee.image ? (
                      <AvatarImage
                        src={employee.image || "/placeholder.svg"}
                        alt={employee.name || "Employee"}
                      />
                    ) : (
                      <AvatarFallback className="text-3xl">
                        {employee.name
                          ? employee.name.charAt(0).toUpperCase()
                          : "E"}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">{employee.name}</CardTitle>
                <CardDescription className="text-base">
                  {employee.position || "No position specified"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">{employee.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">
                      {employee.phone || "No phone number"}
                    </span>
                  </div>
                  <div className="flex items-start gap-3">
                    <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <span className="text-sm">
                      {employee.bio || "No bio available"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <Tabs defaultValue="projects" className="w-full">
                <CardHeader className="pb-0">
                  <div className="flex items-center justify-between">
                    <CardTitle>Employee Information</CardTitle>
                    <TabsList>
                      <TabsTrigger
                        value="projects"
                        className="flex items-center gap-1"
                      >
                        <Briefcase className="h-4 w-4" />
                        Projects
                      </TabsTrigger>
                      <TabsTrigger
                        value="attendance"
                        className="flex items-center gap-1"
                      >
                        <CalendarDays className="h-4 w-4" />
                        Attendance
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>

                <CardContent className="pt-6">
                  <TabsContent value="projects" className="mt-0">
                    <h3 className="text-lg font-semibold mb-4">
                      Assigned Projects
                    </h3>
                    {employee.assignedProjects.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>No projects assigned to this employee.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {employee.assignedProjects.map((proj) => (
                          <Card key={proj.id} className="overflow-hidden">
                            <div className="border-l-4 border-primary p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg">
                                  {proj.project.name}
                                </h4>
                                <Badge
                                  className={cn(
                                    proj.status === "completed" &&
                                      "bg-green-500",
                                    proj.status === "in_progress" &&
                                      "bg-amber-500",
                                    proj.status === "assigned" && "bg-blue-500"
                                  )}
                                >
                                  {proj.status.replace("_", " ")}
                                </Badge>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Work Detail
                                  </p>
                                  <p className="font-medium">
                                    {proj.workDetail}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Deadline
                                  </p>
                                  <p className="font-medium text-destructive">
                                    {new Date(
                                      proj.employeeDeadline
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">
                                    Assigned By
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs">
                                        {proj.admin.name
                                          ? proj.admin.name
                                              .charAt(0)
                                              .toUpperCase()
                                          : "A"}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span>{proj.admin.name}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="attendance" className="mt-0">
                    <h3 className="text-lg font-semibold mb-4">
                      Attendance Records
                    </h3>
                    {employee.attendances.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <Clock className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>No attendance records available.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {employee.attendances.map((att) => (
                          <Card key={att.id} className="p-4">
                            <div className="flex flex-col">
                              <div className="text-sm text-muted-foreground mb-1">
                                {new Date(att.date).toLocaleDateString(
                                  undefined,
                                  {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  }
                                )}
                              </div>
                              <Badge
                                variant={
                                  att.status === "present"
                                    ? "default"
                                    : att.status === "late"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className="w-fit"
                              >
                                {att.status.charAt(0).toUpperCase() +
                                  att.status.slice(1)}
                              </Badge>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </div>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>No Data Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No employee data found for ID: {employeeId}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function EmployeeDetailsSkeleton() {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="md:col-span-1">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <Skeleton className="h-24 w-24 rounded-full" />
            </div>
            <Skeleton className="h-8 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-2/4 mx-auto" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="flex items-start gap-3">
                <Skeleton className="h-5 w-5 rounded-full mt-0.5" />
                <div className="w-full space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-10 w-48 rounded-md" />
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Skeleton className="h-6 w-48 mb-6" />
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="border-l-4 border-primary/20 p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-6 w-24 rounded-full" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <div className="flex items-center gap-2">
                          <Skeleton className="h-6 w-6 rounded-full" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
