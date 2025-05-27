"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../../components/ui/avatar";
import { Skeleton } from "../../../../components/ui/skeleton";
import { AlertCircle, ShieldUser } from "lucide-react";
import { useSidebar } from "../../../../components/ui/sidebar";
import LogoutButton from "../../../../components/Auth/logout-button";
import { Button } from "../../../../components/ui/button";
import { UserRole } from "@prisma/client";

interface ExtendedUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  phone?: string;
  position?: string;
  role?: UserRole;
}

interface UserDataProps {
  data: ExtendedUser | undefined;
  isLoading: boolean;
  error: unknown;
}

export function UserData({ data, error, isLoading }: UserDataProps) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  // Get initials for avatar fallback
  const initials = data?.name
    ? data.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U";

  if (isLoading) {
    return (
      <div className="px-2 py-4 transition-all">
        {isCollapsed ? (
          <div className="flex justify-center py-4">
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        ) : (
          <>
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-3 h-6 w-24">
                <Skeleton className="h-6 w-full" />
              </div>
              <div className="flex flex-col items-center space-y-3">
                <Skeleton className="h-16 w-16 rounded-full" />
                <Skeleton className="h-5 w-[120px]" />
                <Skeleton className="h-4 w-[180px]" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[120px]" />
              </div>
            </div>
            <div className="mt-2.5 flex justify-center">
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          </>
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
              <p className="text-sm font-medium">Unable to load user</p>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="flex justify-center py-4">
        <Avatar className="h-10 w-10 border">
          <AvatarImage src={data?.image || ""} alt={data?.name || "User"} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="px-2 py-4 transition-all">
      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold">Welcome Back</h2>
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-16 w-16 border">
            <AvatarImage src={data?.image || ""} alt={data?.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex justify-between items-center">
            <h3 className="text-base font-medium text-primary">
              {data?.name || "User"}
            </h3>
            {data?.role === "ADMIN" ? (
              <span>
                <ShieldUser />
              </span>
            ) : (
              <></>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{data?.email || ""}</p>

          <p className="text-xs text-muted-foreground">{data?.phone || ""}</p>
          <span className="text-xl text-accent-foreground">
            {data?.position || ""}
          </span>
        </div>
      </div>
      <div className="mt-2.5 flex justify-center">
        <Button variant="outline" className="cursor-pointer">
          <LogoutButton>logout</LogoutButton>
        </Button>
      </div>
    </div>
  );
}
