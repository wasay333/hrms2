import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getPositionBadgeColor(position: string): string {
  const positionLower = position.toLowerCase();

  if (
    positionLower.includes("developer") ||
    positionLower.includes("engineer")
  ) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
  }

  if (
    positionLower.includes("designer") ||
    positionLower.includes("ui") ||
    positionLower.includes("ux")
  ) {
    return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
  }

  if (positionLower.includes("manager") || positionLower.includes("lead")) {
    return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
  }

  if (positionLower.includes("marketing") || positionLower.includes("sales")) {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
  }

  if (
    positionLower.includes("hr") ||
    positionLower.includes("human resources")
  ) {
    return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400";
  }

  if (
    positionLower.includes("ceo") ||
    positionLower.includes("cto") ||
    positionLower.includes("coo") ||
    positionLower.includes("director")
  ) {
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  }

  return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400";
}
export function getProjectTypeBadgeColor(projectType: string | null): string {
  if (!projectType) return "";

  switch (projectType.toLowerCase()) {
    case "web":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    case "mobile":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    case "desktop":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
    case "api":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-400";
  }
}
export function calculateLeaveDays(fromDate: Date, toDate: Date): number {
  console.log(`Input dates - fromDate: ${fromDate}, toDate: ${toDate}`);

  // Create new date objects to avoid mutating the original dates
  const from = new Date(fromDate);
  const to = new Date(toDate);

  // Normalize times to avoid timezone issues
  from.setHours(0, 0, 0, 0);
  to.setHours(0, 0, 0, 0);

  console.log(
    `Normalized dates - from: ${from.toDateString()}, to: ${to.toDateString()}`
  );

  let count = 0;
  const current = new Date(from);
  const weekdays = [];

  while (current <= to) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) {
      // Exclude Sunday (0) and Saturday (6)
      count++;
      weekdays.push(current.toDateString());
    }
    current.setDate(current.getDate() + 1);
  }

  console.log(`Weekdays counted: ${weekdays.join(", ")}`);
  console.log(`Total weekdays: ${count}`);

  return count;
}
