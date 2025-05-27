import { QueryClient } from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minutes
      },
    },
  });
}
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  // Always return a QueryClient
  if (typeof window === "undefined") {
    // Server side
    return makeQueryClient();
  }

  // Client side
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }

  return browserQueryClient;
}
