"use client";
import React from "react";
import { getQueryClient } from "../lib/getQueryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./theme-provider";
import { SessionProvider } from "next-auth/react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const queryClient = getQueryClient();
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default AppProvider;
