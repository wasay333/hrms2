"use client";

import React from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getAllLeaves, getClientCurrentUser } from "../lib/queries/userQueries";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { approveLeave } from "../actions/leave/approval";
import { declineLeave } from "../actions/leave/decline";
import { Leave } from "../lib/types";

const LeaveCardSkeleton = () => (
  <Card className="w-full max-w-md mx-auto mb-4">
    <CardHeader>
      <Skeleton className="h-4 w-1/2" />
    </CardHeader>
    <CardContent className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-full" />
    </CardContent>
  </Card>
);

const AllLeaves = () => {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getClientCurrentUser,
  });

  const { data: leaves, isLoading: leavesLoading } = useQuery({
    queryKey: ["leaves"],
    queryFn: getAllLeaves,
    enabled: !!user && user.role === "ADMIN",
  });

  const handleApprove = async (id: string) => {
    try {
      await approveLeave(id);
      toast.success("Leave approved successfully");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to approve leave"
      );
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await declineLeave(id);
      toast.success("Leave declined successfully");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to decline leave"
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h1 className="text-2xl font-bold mb-6">All Leave Requests</h1>
      {leavesLoading
        ? Array.from({ length: 3 }).map((_, i) => <LeaveCardSkeleton key={i} />)
        : leaves?.map((leave: Leave) => (
            <Card key={leave.id} className="mb-4">
              <CardHeader className="flex flex-row justify-between items-center">
                <div>
                  <CardTitle>{leave.user.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {leave.type} leave
                  </p>
                </div>
                {leave.status === "pending" && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleApprove(leave.id)}>
                        Approve
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDecline(leave.id)}>
                        Decline
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </CardHeader>
              <CardContent>
                <p>
                  <strong>Reason:</strong> {leave.reason}
                </p>
                <p>
                  <strong>From:</strong>{" "}
                  {new Date(leave.fromDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>To:</strong>{" "}
                  {new Date(leave.toDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      leave.status === "approved"
                        ? "text-green-600"
                        : leave.status === "declined"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {leave.status}
                  </span>
                </p>
              </CardContent>
            </Card>
          ))}
    </div>
  );
};

export default AllLeaves;
