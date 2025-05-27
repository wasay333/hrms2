"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "../components/ui/chart";
import { LeaveBalance } from "../lib/types";

const chartConfig = {
  used: {
    label: "Used",
    color: "hsl(var(--chart-1))",
  },
  remaining: {
    label: "Remaining",
    color: "hsl(var(--chart-2))",
  },
  total: {
    label: "Total",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

interface LeaveBalanceProps {
  data: LeaveBalance | undefined;
  isLoading: boolean;
  error: unknown;
}

const transformBalanceToChartData = (leaveBalance: LeaveBalance) => {
  return [
    {
      name: "Used",
      value: leaveBalance.used,
      fill: chartConfig.used.color,
    },
    {
      name: "Remaining",
      value: leaveBalance.remaining,
      fill: chartConfig.remaining.color,
    },
  ];
};

export function LeaveLeft({ data }: LeaveBalanceProps) {
  const chartData = data ? transformBalanceToChartData(data) : [];
  const hasData =
    chartData.length > 0 && chartData.some((item) => item.value > 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Leave - Balance Overview</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {!hasData ? (
          <p className="text-muted-foreground">No data available</p>
        ) : (
          <div className="w-[260px] h-[260px]">
            <ChartContainer
              config={chartConfig}
              className="mx-auto aspect-square max-h-[250px]"
            >
              <PieChart width={250} height={250}>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
