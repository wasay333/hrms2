import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

// Hook to clear React Query cache when user session changes
export function useSessionCacheManager() {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const previousUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    const currentUserId = session?.user?.id || null;

    // If user changed (including logout), clear all cache
    if (
      previousUserIdRef.current !== null &&
      previousUserIdRef.current !== currentUserId
    ) {
      queryClient.clear(); // Clear all cached queries
    }

    previousUserIdRef.current = currentUserId;
  }, [session?.user?.id, queryClient]);
}

// Alternative: Use this in your main layout or app component
export function SessionCacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useSessionCacheManager();
  return children;
}
