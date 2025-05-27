"use client";

import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../components/ui/chart";
import { Project } from "@prisma/client";

const chartConfig = {
  ongoing: {
    label: "Ongoing",
    color: "hsl(var(--chart-1))",
  },
  completed: {
    label: "Completed",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

interface ProjectProps {
  data: Project[] | undefined;
  isLoading: boolean;
  error: unknown;
}
const transformProjectsToChartData = (projects: Project[]) => {
  const statusCountMap: Record<string, number> = {
    ongoing: 0,
    completed: 0,
  };

  for (const project of projects) {
    const status = project.mainStatus.toLowerCase();
    if (status in statusCountMap) {
      statusCountMap[status]++;
    }
  }

  return Object.entries(statusCountMap).map(([status, count]) => ({
    status,
    count,
    fill: chartConfig[status as keyof typeof chartConfig].color,
  }));
};

export function ProjectChart({ data }: ProjectProps) {
  const chartData = data ? transformProjectsToChartData(data) : [];
  const hasData = chartData.some((item) => item.count > 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Projects - Analytics</CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex justify-center items-center">
        {!hasData ? (
          <p className="text-muted-foreground">No data available</p>
        ) : (
          <div className="w-[260px] h-[260px]">
            <ChartContainer
              config={chartConfig}
              className="[&_.recharts-pie-label-text]:fill-foreground w-full h-full"
            >
              <PieChart width={250} height={250}>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie data={chartData} dataKey="count" nameKey="status" label />
              </PieChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
