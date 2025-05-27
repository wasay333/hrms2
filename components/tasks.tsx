import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

type Task = {
  id: string;
  task: string;
  userName: string;
  userEmail: string;
};

type ErrorStateProps = {
  error: Error;
};

type TaskItemProps = {
  task: Task;
  onClick: () => void;
};

const fetchTasks = async () => {
  const response = await fetch("/api/allWorks");

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.error || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
};

const TaskSkeleton = () => (
  <div className="space-y-3">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="flex items-center space-x-4 p-4 rounded-lg border"
      >
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-3/4" />
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="min-h-[300px] rounded-xl border border-dashed border-muted flex flex-col items-center justify-center text-muted-foreground space-y-3">
    <CheckCircle2 className="h-12 w-12 text-muted-foreground/50" />
    <div className="text-center">
      <p className="text-lg font-medium">No tasks found</p>
      <p className="text-sm">Tasks will appear here when they are created</p>
    </div>
  </div>
);

const ErrorState = ({ error }: ErrorStateProps) => (
  <div className="min-h-[300px] rounded-xl border border-dashed border-destructive/20 flex flex-col items-center justify-center text-destructive space-y-3">
    <AlertCircle className="h-12 w-12" />
    <div className="text-center">
      <p className="text-lg font-medium">Failed to load tasks</p>
      <p className="text-sm opacity-80">
        {error?.message || "Something went wrong"}
      </p>
    </div>
  </div>
);

const TaskItem = ({ task, onClick }: TaskItemProps) => (
  <li
    className="group transition-all duration-200 hover:scale-[1.02] hover:shadow-lg cursor-pointer w-[300px]"
    onClick={onClick}
  >
    <Card className="border-l-4 border-l-primary/20 group-hover:border-l-primary transition-all duration-200 group-hover:shadow-md">
      <CardContent className="p-1">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge
                variant="secondary"
                className="font-semibold group-hover:bg-primary/10 transition-colors duration-200"
              >
                {task.userName}
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors duration-200">
              {task.userEmail}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground/50 group-hover:text-muted-foreground/70 transition-colors duration-200">
              Click to view task details
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  </li>
);

export default function TaskListing() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    data: tasks,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedTask(null);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Today&apos;s Tasks
          </h2>
          <Badge variant="outline">Loading...</Badge>
        </div>
        <TaskSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Today&apos;s Tasks
          </h2>
          <Badge variant="destructive">Error</Badge>
        </div>
        <ErrorState error={error} />
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Today&apos;s Tasks
          </h2>
          <Badge variant="secondary">0 tasks</Badge>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">
          employee&apos;s reports
        </h2>
        <Badge
          variant="default"
          className="bg-primary/10 text-primary hover:bg-primary/20"
        >
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </Badge>
      </div>

      <ul className="space-y-3">
        {tasks.map((task: Task) => (
          <TaskItem
            key={task.id}
            task={task}
            onClick={() => handleTaskClick(task)}
          />
        ))}
      </ul>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto [&>button]:hidden">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Task Details
            </DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 rounded-full h-8 w-8"
            onClick={handleCloseDialog}
          >
            <X className="h-4 w-4" />
          </Button>

          {selectedTask && (
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <Badge variant="secondary" className="font-semibold">
                  {selectedTask.userName}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {selectedTask.userEmail}
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Task Description:
                </h3>
                <div className="p-4 bg-background border rounded-lg">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {selectedTask.task}
                  </p>
                </div>
                <p className="text-xs font-thin italic text-muted-foreground">
                  Click outside the dialog to close
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
