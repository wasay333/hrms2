"use client";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import * as z from "zod";
import { LoginSchema } from "../../schema/index";
import React from "react";
import { CardWrapper } from "./card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
  FormField,
} from "../ui/form";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "../../actions/login";
import Link from "next/link";
import { DEFAULT_LOGIN_REDIRECT } from "../../routes";
import { useQueryClient } from "@tanstack/react-query";

export const LoginForm = () => {
  const queryClient = useQueryClient();

  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          }
          if (data?.success) {
            form.reset();
            setSuccess(data.success);
            // Clear React Query cache on successful login
            queryClient.clear();

            // Force router refresh to clear any cached data
            router.refresh();
            if (
              !data.lastAttendanceDate ||
              new Date(data.lastAttendanceDate).toDateString() !==
                new Date().toDateString()
            ) {
              router.push("/attendCreate");
            } else {
              router.push(DEFAULT_LOGIN_REDIRECT);
            }
          }
        })
        .catch((err) => {
          console.error("Error during login:", err);

          setError("Something went wrong");
        });
    });
  };
  return (
    <CardWrapper headerLabel="Welcome back">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="john.doe@example.com"
                      type="email"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="*****"
                      type="password"
                      disabled={isPending}
                    />
                  </FormControl>
                  <Button
                    size="sm"
                    asChild
                    variant="link"
                    className="px-0 font-normal"
                  >
                    <Link href="/auth/reset">Forget password?</Link>
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button type="submit" className="w-full" disabled={isPending}>
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
