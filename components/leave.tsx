"use client";

import React from "react";

import { useQuery } from "@tanstack/react-query";
import { getSingleLeaveOfLoggedInUser } from "../lib/queries/userQueries";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  CalendarRange,
  AlertCircle,
  Clock,
  Calendar,
  ArrowLeft,
  FileText,
  Tag,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";

interface Leave {
  id: string;
  reason: string;
  fromDate: Date;
  toDate: Date;
  type: string;
  status: "pending" | "approved" | "rejected" | string;
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return {
        color: "bg-green-500",
        textColor: "text-green-600 dark:text-green-400",
        borderColor: "border-green-500",
        bgColor: "bg-green-50 dark:bg-green-950/20",
        icon: CheckCircle2,
      };
    case "rejected":
      return {
        color: "bg-red-500",
        textColor: "text-red-600 dark:text-red-400",
        borderColor: "border-red-500",
        bgColor: "bg-red-50 dark:bg-red-950/20",
        icon: XCircle,
      };
    case "pending":
      return {
        color: "bg-amber-500",
        textColor: "text-amber-600 dark:text-amber-400",
        borderColor: "border-amber-500",
        bgColor: "bg-amber-50 dark:bg-amber-950/20",
        icon: Clock3,
      };
    default:
      return {
        color: "bg-gray-500",
        textColor: "text-gray-600 dark:text-gray-400",
        borderColor: "border-gray-500",
        bgColor: "bg-gray-50 dark:bg-gray-950/20",
        icon: CalendarRange,
      };
  }
};

const calculateDuration = (fromDate: Date, toDate: Date) => {
  const start = new Date(fromDate);
  const end = new Date(toDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays + 1; // Include both start and end days
};

export default function LeaveDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const leaveRequestId = params?.id as string;

  const { data, isLoading, error } = useQuery<Leave>({
    queryKey: ["leave", leaveRequestId],
    queryFn: () => getSingleLeaveOfLoggedInUser(leaveRequestId),
    enabled: !!leaveRequestId, // ensures query doesn't run if id is missing
  });

  if (error)
    return (
      <div className="container mx-auto py-8 px-4">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => {
            router.push("/leaves");
          }}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaves
        </Button>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading the leave details. Please try again
            later.
          </AlertDescription>
        </Alert>
      </div>
    );

  return (
    <div className="container mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => {
          router.push("/leaves");
        }}
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Leaves
      </Button>

      {isLoading ? (
        <LeaveDetailsSkeleton />
      ) : (
        data && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Main details card */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl">Leave Details</CardTitle>
                      <CardDescription>Request ID: {data.id}</CardDescription>
                    </div>
                    {data.status && (
                      <Badge
                        className={`${getStatusConfig(data.status).textColor} ${
                          getStatusConfig(data.status).borderColor
                        }`}
                        variant="outline"
                      >
                        {data.status.charAt(0).toUpperCase() +
                          data.status.slice(1)}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-1">
                    <div className="flex items-center text-muted-foreground mb-2">
                      <FileText className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">Reason</span>
                    </div>
                    <p className="text-base">{data.reason}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Tag className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Leave Type</span>
                      </div>
                      <p className="text-base font-medium">{data.type}</p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Clock className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">Duration</span>
                      </div>
                      <p className="text-base font-medium">
                        {calculateDuration(data.fromDate, data.toDate)}{" "}
                        {calculateDuration(data.fromDate, data.toDate) === 1
                          ? "day"
                          : "days"}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">From Date</span>
                      </div>
                      <p className="text-base font-medium">
                        {new Date(data.fromDate).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm font-medium">To Date</span>
                      </div>
                      <p className="text-base font-medium">
                        {new Date(data.toDate).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Status card */}
              <Card className={getStatusConfig(data.status).bgColor}>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <span
                      className={`p-2 rounded-full ${getStatusConfig(data.status).bgColor} ${
                        getStatusConfig(data.status).textColor
                      } mr-2`}
                    >
                      {React.createElement(getStatusConfig(data.status).icon, {
                        className: "h-5 w-5",
                      })}
                    </span>
                    Status Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Current Status
                    </p>
                    <p
                      className={`font-semibold ${getStatusConfig(data.status).textColor}`}
                    >
                      {data.status.charAt(0).toUpperCase() +
                        data.status.slice(1)}
                    </p>
                  </div>

                  {data.status === "pending" && (
                    <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
                      <Clock3 className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                      <AlertTitle className="text-amber-600 dark:text-amber-400">
                        Awaiting Review
                      </AlertTitle>
                      <AlertDescription className="text-amber-700 dark:text-amber-300">
                        Your leave request is pending approval. You will be
                        notified once it&apos;s reviewed.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          </>
        )
      )}
    </div>
  );
}

function LeaveDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Main details card skeleton */}
      <Card className="md:col-span-2">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-8 w-40 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-32" />
            </div>

            <div className="space-y-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>

          <Skeleton className="h-px w-full" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>

            <div className="space-y-1">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-5 w-48" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status card skeleton */}
      <Card>
        <CardHeader>
          <div className="flex items-center">
            <Skeleton className="h-10 w-10 rounded-full mr-2" />
            <Skeleton className="h-6 w-32" />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-5 w-20" />
          </div>

          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-5 w-36" />
          </div>

          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-40 mt-1" />
          </div>

          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-5 w-36" />
          </div>

          <Skeleton className="h-20 w-full rounded-md" />
        </CardContent>
      </Card>
    </div>
  );
}
