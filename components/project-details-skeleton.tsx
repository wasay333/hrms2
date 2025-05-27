import { Skeleton } from "../components/ui/skeleton";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { ChevronDown, Plus, Trash2 } from "lucide-react";

export function ProjectDetailsSkeleton() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Project Header Card Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-9 w-2/3 mb-2" />
          <Skeleton className="h-5 w-full max-w-md" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center">
            <Skeleton className="h-5 w-12 mr-2" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <Skeleton className="h-5 w-16 mr-2" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-32 mr-2 ml-2" />
            <Skeleton className="h-5 w-28" />
          </div>
        </CardContent>
      </Card>

      {/* Team Members Header Skeleton */}
      <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg">
        <Skeleton className="h-8 w-40" />
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2" disabled>
            <Plus className="h-4 w-4" />
            Add Employee
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>

          <Button variant="outline" className="gap-2" disabled>
            <Trash2 className="h-4 w-4" />
            Remove Employee
            <ChevronDown className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Team Members Cards Skeleton */}
      <div className="grid gap-4">
        {[1, 2, 3].map((index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-0">
                {/* Team member info column skeleton */}
                <div className="bg-muted/30 p-6 md:border-r">
                  <div className="flex flex-col space-y-3">
                    <Skeleton className="h-7 w-3/4" />
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-20 rounded-full mt-1" />
                  </div>
                </div>

                {/* Work details column skeleton */}
                <div className="p-6 md:col-span-3">
                  <div className="space-y-4">
                    <div>
                      <Skeleton className="h-6 w-32 mb-3" />
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t">
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-5 w-40" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-5 w-32" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
