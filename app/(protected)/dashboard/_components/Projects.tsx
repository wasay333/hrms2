"use client";
import { getProjectTypeBadgeColor } from "../../../../lib/utils";
import { useState } from "react";
import { Skeleton } from "../../../../components/ui/skeleton";
import { AlertCircle, ChevronDown, FolderKanban, PlusIcon } from "lucide-react";
import { Badge } from "../../../../components/ui/Badge";
import { Button } from "../../../../components/ui/button";
import { cn } from "../../../../lib/utils";
import { useRouter } from "next/navigation";

interface Project {
  id: string;
  name: string | null;
  createdAt: Date;
  detail: string | null;
  projectType: string | null;
}

interface ProjectsProps {
  data: Project[] | undefined;
  isLoading: boolean;
  error: unknown;
  isCollapsed?: boolean;
}

export function Projects({
  data,
  error,
  isLoading,
  isCollapsed,
}: ProjectsProps) {
  const [visibleCount, setVisibleCount] = useState(3);
  const router = useRouter();
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
              <h3 className="text-sm font-medium">Projects</h3>
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-md border p-3"
              >
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
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
              <p className="text-sm font-medium">Unable to load projects</p>
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
          <FolderKanban className="h-5 w-5" />
        </div>
      </div>
    );
  }

  const hasMoreItems = data && data.length > visibleCount;
  const visibleProjects = data?.slice(0, visibleCount) || [];

  return (
    <div className="px-2 py-4 transition-all">
      <div className="space-y-3">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-sm font-medium">
            Projects
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
              router.push("/projectCreate");
            }}
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </div>

        {!data || data.length === 0 ? (
          <div className="rounded-md border border-dashed p-4 text-center">
            <p className="text-sm text-muted-foreground">No projects found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visibleProjects.map((project) => (
              <div
                key={project.id}
                className="group flex items-center justify-between rounded-md border bg-card p-3 transition-colors hover:bg-accent/50 cursor-pointer"
                onClick={() => router.push(`/project/${project.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    router.push(`/project/${project.id}`);
                  }
                }}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <FolderKanban className="h-4 w-4" />
                  </div>
                  <span className="truncate font-medium">
                    {project.name || "Untitled Project"}
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className={cn(
                    "transition-all group-hover:bg-background",
                    getProjectTypeBadgeColor(project.projectType)
                  )}
                >
                  {project.projectType || "Other"}
                </Badge>
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
