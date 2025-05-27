"use client";
import { getAllLeavesOfLoggedInUser } from "../lib/queries/userQueries";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/skeleton";
import { CalendarRange, AlertCircle, Clock, Calendar } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert";
import { Button } from "../components/ui/button";

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
        variant: "success",
        textColor: "text-green-600 dark:text-green-400",
      };
    case "rejected":
      return {
        color: "bg-red-500",
        variant: "destructive",
        textColor: "text-red-600 dark:text-red-400",
      };
    case "pending":
      return {
        color: "bg-amber-500",
        variant: "warning",
        textColor: "text-amber-600 dark:text-amber-400",
      };
    default:
      return {
        color: "bg-gray-500",
        variant: "outline",
        textColor: "text-gray-600 dark:text-gray-400",
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

export default function LeavesPage() {
  const { data, isLoading, error } = useQuery<Leave[]>({
    queryKey: ["leaves"],
    queryFn: getAllLeavesOfLoggedInUser,
  });

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Your Leaves</h1>
          <p className="text-muted-foreground">
            View and manage your leave requests
          </p>
        </div>
        <Button asChild>
          <Link href="/leaveCreate">Request Leave</Link>
        </Button>
      </div>

      {isLoading ? (
        <LeaveSkeletonLoader />
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            There was an error loading your leave records. Please try again
            later.
          </AlertDescription>
        </Alert>
      ) : data?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarRange className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
            <p className="text-xl font-medium mb-2">No leave records found</p>
            <p className="text-muted-foreground text-center max-w-md mb-6">
              You haven&apos;t requested any leaves yet. Click the button below
              to submit a new leave request.
            </p>
            <Button asChild>
              <Link href="/leaveCreate">Request Leave</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((leave: Leave) => {
            const statusConfig = getStatusConfig(leave.status);
            const fromDate = new Date(leave.fromDate);
            const toDate = new Date(leave.toDate);
            const duration = calculateDuration(fromDate, toDate);

            return (
              <Link
                href={`/leave/${leave.id}`}
                key={leave.id}
                className="block transition-transform hover:scale-[1.02]"
              >
                <Card className="h-full overflow-hidden">
                  <div className={`${statusConfig.color} h-1 w-full`} />
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{leave.type}</CardTitle>
                      <Badge
                        variant="outline"
                        className={`${statusConfig.textColor} border-${statusConfig.color.replace("bg-", "")}`}
                      >
                        {leave.status}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {leave.reason}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" /> From
                        </span>
                        <span className="font-medium">
                          {fromDate.toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" /> To
                        </span>
                        <span className="font-medium">
                          {toDate.toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {duration} {duration === 1 ? "day" : "days"}
                      </span>
                    </div>
                  </CardFooter>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function LeaveSkeletonLoader() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-full overflow-hidden">
          <Skeleton className="h-1 w-full" />
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
            <div className="space-y-2 mt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col">
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex flex-col">
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Skeleton className="h-4 w-16" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
