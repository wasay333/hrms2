"use client";

import { useState } from "react";
import { Skeleton } from "../../../../components/ui/skeleton";
import { AlertCircle, ChevronDown, PlusIcon, Users } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { cn, getPositionBadgeColor } from "../../../../lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "../../../../components/ui/Badge";

interface Employee {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  image?: string | null;
  position?: string | null;
  bio?: string | null;
  dateOfJoining?: Date | null;
  role?: string;
  createdAt: Date;
}

interface EmployeesProps {
  data: Employee[] | undefined;
  isLoading: boolean;
  error: unknown;
  isCollapsed?: boolean;
}

export function Employees({
  data,
  error,
  isLoading,
  isCollapsed,
}: EmployeesProps) {
  const router = useRouter();

  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  if (isLoading) {
    return (
      <div className="px-2 py-4 transition-all">
        {isCollapsed ? (
          <div className="flex justify-center py-4">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-2 py-1">
              <h3 className="text-sm font-medium">Employees</h3>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-5 w-16" />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-2 py-4 transition-all">
        {isCollapsed ? (
          <div className="flex justify-center py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-red-50 text-red-600">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-red-100 bg-red-50 p-4 shadow-sm">
            <div className="flex items-center justify-center space-x-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">Unable to load employees</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-primary/10 text-primary">
          <Users className="h-5 w-5" />
        </div>
      </div>
    );
  }

  const hasMoreItems = data && data.length > visibleCount;
  const visibleEmployees = data?.slice(0, visibleCount) || [];

  return (
    <div className="px-1 py-4 transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-medium">
            Employees{" "}
            <span>
              <Badge variant="outline" className="text-xs">
                {data?.length || 0}
              </Badge>
            </span>
          </h3>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-primary cursor-pointer"
            onClick={() => {
              router.push("/invite");
            }}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        {!data || data.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground">No employees found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleEmployees.map((employee) => (
              <div
                key={employee.id}
                className="group flex items-center justify-between rounded-md border bg-card p-3 transition-colors hover:bg-accent/50 cursor-pointer"
                onClick={() => router.push(`/employee/${employee.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push(`/employee/${employee.id}`);
                  }
                }}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <Avatar className="h-8 w-8 border">
                    <AvatarImage
                      src={employee.image || ""}
                      alt={employee.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs">
                      {getInitials(employee.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="truncate font-medium">{employee.name}</span>
                </div>
                {employee.position && (
                  <Badge
                    variant="secondary"
                    className={cn(
                      "transition-all group-hover:bg-background",
                      getPositionBadgeColor(employee.position)
                    )}
                  >
                    {employee.position}
                  </Badge>
                )}
              </div>
            ))}

            {hasMoreItems && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-center text-xs text-muted-foreground hover:text-foreground"
                onClick={handleLoadMore}
              >
                Load more
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get initials from name
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}
