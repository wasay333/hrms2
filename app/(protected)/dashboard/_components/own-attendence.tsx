"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getUserAttendance } from "../../../../lib/queries/userQueries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/Badge";
import { Skeleton } from "../../../../components/ui/skeleton";
import {
  CalendarDays,
  AlertCircle,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../../../../components/ui/alert";

interface AttendanceRecord {
  id: string;
  date: string;
  status: "present" | "absent" | "late";
  checkInTime?: string;
  checkOutTime?: string;
}

const statusConfig = {
  present: {
    icon: CheckCircle2,
    color: "bg-green-500",
    label: "Present",
  },
  absent: {
    icon: XCircle,
    color: "bg-red-500",
    label: "Absent",
  },
  late: {
    icon: Clock,
    color: "bg-amber-500",
    label: "Late",
  },
};

export default function AttendancePage() {
  const {
    data: attendance,
    isLoading,
    error,
  } = useQuery<AttendanceRecord[]>({
    queryKey: ["attendance"],
    queryFn: getUserAttendance,
  });

  const getMonthName = (date: Date) => {
    return date.toLocaleString("default", { month: "long" });
  };

  // Group attendance records by month
  const groupedAttendance = React.useMemo(() => {
    if (!attendance) return {};

    return attendance.reduce<Record<string, AttendanceRecord[]>>(
      (acc, record) => {
        const date = new Date(record.date);
        const monthYear = `${getMonthName(date)} ${date.getFullYear()}`;

        if (!acc[monthYear]) {
          acc[monthYear] = [];
        }

        acc[monthYear].push(record);
        return acc;
      },
      {}
    );
  }, [attendance]);

  // Calculate attendance statistics
  const stats = React.useMemo(() => {
    if (!attendance) return { total: 0, present: 0, absent: 0, late: 0 };

    return attendance.reduce(
      (acc, record) => {
        acc.total++;
        if (record.status in acc) {
          acc[record.status]++;
        }
        return acc;
      },
      { total: 0, present: 0, absent: 0, late: 0 }
    );
  }, [attendance]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Attendance</h1>
        <p className="text-muted-foreground">
          Track and monitor your attendance records
        </p>
      </div>

      {isLoading ? (
        <AttendanceSkeletonLoader />
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading your attendance records. Please try again
            later.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          {/* Attendance Statistics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Total Records
                  </p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 dark:bg-green-950/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Present
                  </p>
                  <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                    {stats.present}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-red-50 dark:bg-red-950/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Absent
                  </p>
                  <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                    {stats.absent}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 dark:bg-amber-950/20">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground mb-1">
                    Late
                  </p>
                  <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
                    {stats.late}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {attendance && attendance.length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedAttendance).map(([monthYear, records]) => (
                <Card key={monthYear}>
                  <CardHeader>
                    <CardTitle>{monthYear}</CardTitle>
                    <CardDescription>
                      {records.length} attendance records
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {records.map((record) => {
                        const date = new Date(record.date);
                        const StatusIcon =
                          statusConfig[record.status]?.icon || CalendarDays;
                        const statusColor =
                          statusConfig[record.status]?.color || "bg-gray-500";
                        const statusLabel =
                          statusConfig[record.status]?.label || record.status;

                        return (
                          <Card key={record.id} className="overflow-hidden">
                            <div className={`${statusColor} h-1 w-full`} />
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-medium">
                                    {date.toLocaleDateString(undefined, {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "short",
                                    })}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {date.toLocaleDateString(undefined, {
                                      year: "numeric",
                                    })}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`flex items-center gap-1 ${
                                    record.status === "present"
                                      ? "border-green-500 text-green-600 dark:text-green-400"
                                      : record.status === "absent"
                                        ? "border-red-500 text-red-600 dark:text-red-400"
                                        : "border-amber-500 text-amber-600 dark:text-amber-400"
                                  }`}
                                >
                                  <StatusIcon className="h-3 w-3" />
                                  <span>{statusLabel}</span>
                                </Badge>
                              </div>

                              {(record.checkInTime || record.checkOutTime) && (
                                <div className="mt-3 pt-3 border-t border-border grid grid-cols-2 gap-2 text-sm">
                                  {record.checkInTime && (
                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Check in
                                      </p>
                                      <p>{record.checkInTime}</p>
                                    </div>
                                  )}
                                  {record.checkOutTime && (
                                    <div>
                                      <p className="text-xs text-muted-foreground">
                                        Check out
                                      </p>
                                      <p>{record.checkOutTime}</p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CalendarDays className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
                <p className="text-xl font-medium mb-2">
                  No attendance records found
                </p>
                <p className="text-muted-foreground text-center max-w-md">
                  Your attendance records will appear here once they are
                  recorded in the system.
                </p>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}

function AttendanceSkeletonLoader() {
  return (
    <>
      {/* Skeleton for statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="text-center">
                <Skeleton className="h-4 w-24 mx-auto mb-2" />
                <Skeleton className="h-8 w-12 mx-auto" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Skeleton for attendance records */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-1 w-full" />
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
