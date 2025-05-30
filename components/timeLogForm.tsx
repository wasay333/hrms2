"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CardWrapper } from "./Auth/card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { TimeLogFormSchema } from "../schema";
import { LogCreation } from "../actions/log-creation";
import { AssignedProject } from "../lib/types";

type FormData = z.infer<typeof TimeLogFormSchema>;
interface LogProps {
  data: AssignedProject[];
  isLoading: boolean;
  error: unknown;
}
export function TimeLogForm({ data }: LogProps) {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const queryClient = useQueryClient();
  const router = useRouter();
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);
  const form = useForm<FormData>({
    resolver: zodResolver(TimeLogFormSchema),
    defaultValues: {
      date: "",
      hoursWorked: "",
      projectId: "",
    },
  });
  const mutation = useMutation({
    mutationFn: LogCreation,
    onError: (error: unknown) => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
      setSuccess(undefined);
    },
    onSuccess: (data) => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      if ("error" in data && data.error) {
        setError(data.error);
        setSuccess(undefined);
        return;
      }

      if ("success" in data && data.success) {
        setSuccess(data.success);
        setError(undefined);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["logs"] });
        router.push(`/dashboard`);
        successTimeoutRef.current = setTimeout(() => {
          setSuccess(undefined);
        }, 3000);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof TimeLogFormSchema>) => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    setError("");
    setSuccess("");
    mutation.mutate(values);
  };

  return (
    <CardWrapper>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="projectId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={mutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select project" />
                      </SelectTrigger>
                      <SelectContent>
                        {data?.map((proj) => (
                          <SelectItem
                            key={proj.projectId}
                            value={proj.projectId}
                          >
                            {proj.project.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="date"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="hoursWorked"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>no of hours work on this project</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="string"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feedback Messages */}
            <FormError message={error} />
            <FormSuccess message={success} />

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={mutation.isPending}
            >
              {mutation.isPending
                ? "sending work log..."
                : "work log sent successfully"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
