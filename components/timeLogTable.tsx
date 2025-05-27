import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Calendar, Clock, User, FolderOpen, RefreshCw } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/Badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { TimeLog } from "../lib/types";
import { useTimeLogs } from "../lib/queries/timeLogQuery";

export const useRefreshTimeLogs = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.invalidateQueries({ queryKey: ["timeLogs"] });
  };
};

export const useOptimisticTimeLogUpdate = () => {
  const queryClient = useQueryClient();

  return (newLog: TimeLog) => {
    queryClient.setQueryData(["timeLogs"], (oldData: TimeLog[] | undefined) => {
      if (!oldData) return [newLog];
      return [newLog, ...oldData];
    });
  };
};

export default function TimeLogsTable() {
  const { data: logs = [], isLoading, error, isRefetching } = useTimeLogs();
  const queryClient = useQueryClient();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getHoursBadgeVariant = (hours: number) => {
    if (hours >= 8) return "default";
    if (hours >= 6) return "secondary";
    return "outline";
  };

  const handleManualRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["timeLogs"] });
  };

  useEffect(() => {
    const handleTimeLogAdded = () => {
      queryClient.invalidateQueries({ queryKey: ["timeLogs"] });
    };

    window.addEventListener("timeLogAdded", handleTimeLogAdded);

    return () => {
      window.removeEventListener("timeLogAdded", handleTimeLogAdded);
    };
  }, [queryClient]);

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Time Logs</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <RefreshCw className="h-4 w-4 animate-spin" />
              Loading...
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Employee</TableHead>
                <TableHead>Project</TableHead>
                <TableHead className="text-right">Hours Worked</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <div className="text-destructive mb-2">Error loading time logs</div>
          <div className="text-sm text-muted-foreground mb-4">
            {error instanceof Error ? error.message : "An error occurred"}
          </div>
          <Button onClick={handleManualRefresh}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  if (logs.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Time Logs</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefetching}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center bg-muted/50 rounded-lg">
            <div className="text-muted-foreground mb-2 text-lg font-medium">
              No time logs found
            </div>
            <div className="text-sm text-muted-foreground">
              Time logs will appear here once employees start logging their
              hours.
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Time Logs</CardTitle>
          <div className="flex items-center gap-4">
            {isRefetching && (
              <div className="flex items-center gap-2 text-sm text-primary">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Updating...
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleManualRefresh}
              disabled={isRefetching}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${isRefetching ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[150px]">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Employee
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Project
                </div>
              </TableHead>
              <TableHead className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <Clock className="h-4 w-4" />
                  Hours Worked
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-medium">
                  {formatDate(log.date)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-primary">
                        {log.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium">{log.userName}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <span>{log.projectName}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={getHoursBadgeVariant(log.hoursWorked)}
                    className="font-mono"
                  >
                    {log.hoursWorked}h
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground bg-muted/50 px-4 py-2 rounded-md">
          <span>Total entries: {logs.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}
