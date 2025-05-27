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
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { Button } from "./ui/button";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { todayWorkSchema } from "../schema";
import { Textarea } from "./ui/textarea";
import { TodayWorkCreation } from "../actions/todayWorkCreation";

type FormData = z.infer<typeof todayWorkSchema>;

export function TodayWorkForm() {
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
    resolver: zodResolver(todayWorkSchema),
    defaultValues: {
      task: "",
    },
  });
  const mutation = useMutation({
    mutationFn: TodayWorkCreation,
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
        queryClient.invalidateQueries({ queryKey: ["task"] });
        router.push(`/dashboard`);
        successTimeoutRef.current = setTimeout(() => {
          setSuccess(undefined);
        }, 3000);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof todayWorkSchema>) => {
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    setError("");
    setSuccess("");
    mutation.mutate(values);
  };

  return (
    <CardWrapper headerLabel="Today Work Form">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="task"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Give your today work</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={5}
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
                ? "sending today work details..."
                : "work details sent successfully"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
