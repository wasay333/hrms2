import { useQuery } from "@tanstack/react-query";
import { TimeLog } from "../types";

export const useTimeLogs = () => {
  return useQuery({
    queryKey: ["timeLogs"],
    queryFn: async (): Promise<TimeLog[]> => {
      const response = await fetch("/api/all-logs");
      if (!response.ok) {
        throw new Error("Failed to fetch logs");
      }
      return response.json();
    },
    staleTime: 30000,
    refetchInterval: 60000,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};
