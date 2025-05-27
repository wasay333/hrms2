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
import { Leave } from "../lib/types";

const chartConfig = {
  pending: {
    label: "Pending",
    color: "hsl(var(--chart-3))",
  },
  approved: {
    label: "Approved",
    color: "hsl(var(--chart-4))",
  },
  declined: {
    label: "Declined",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

interface LeavesProps {
  data: Leave[] | undefined;
  isLoading: boolean;
  error: unknown;
}

const transformleavesToChartData = (leaves: Leave[]) => {
  const statusCountMap: Record<string, number> = {
    approved: 0,
    pending: 0,
    declined: 0,
  };

  for (const leave of leaves) {
    const status = leave.status.toLowerCase();
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

export function LeaveChart({ data }: LeavesProps) {
  const chartData = data ? transformleavesToChartData(data) : [];
  const hasData = chartData.some((item) => item.count > 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Leave - Analytics</CardTitle>
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
