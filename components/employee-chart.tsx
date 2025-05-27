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
import { Employee } from "../lib/types";

interface ProjectProps {
  data: Employee[] | undefined;
  isLoading: boolean;
  error: unknown;
}

const chartConfig = {
  remote: {
    label: "Remote",
    color: "hsl(var(--chart-1))",
  },
  onsite: {
    label: "Onsite",
    color: "hsl(var(--chart-2))",
  },
  contract: {
    label: "Contract",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

const transformEmployeesToChartData = (employees: Employee[]) => {
  const statusCountMap: Record<string, number> = {
    remote: 0,
    onsite: 0,
    contract: 0,
  };

  for (const employee of employees) {
    const status = employee.jobtype.toLowerCase();
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

export function EmployeeChart({ data }: ProjectProps) {
  const chartData = data ? transformEmployeesToChartData(data) : [];

  const hasData = chartData.some((item) => item.count > 0);
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Employee - Analytics</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex justify-center items-center">
        {!hasData ? (
          <p className="text-muted-foreground">No data available</p>
        ) : (
          <div className="w-[260px] h-[260px]">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
            >
              <PieChart>
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
