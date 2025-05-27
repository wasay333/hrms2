"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { employeeSchema } from "../../schema/index";
import { JobType, UserRole } from "@prisma/client";
import { useState } from "react";
import { inviteEmployee } from "../../actions/employee/creation";
import { CardWrapper } from "./card-wrapper";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof employeeSchema>;

export function AdminInviteForm() {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      role: UserRole.EMPLOYEE,
      name: "",
      email: "",
      phone: "",
      position: "",
      bio: "",
      dateOfJoining: "",
      password: "",
      jobtype: "onsite",
    },
  });
  const mutation = useMutation({
    mutationFn: inviteEmployee,
    onError: (error: unknown) => {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Something went wrong");
      }
      setSuccess(undefined);
    },
    onSuccess: (data) => {
      if (data?.error) {
        setError(error);
        setSuccess(undefined);
        form.reset();
        return;
      }
      if (data?.success) {
        setSuccess(data.success);
        setError(undefined);
        form.reset();
        queryClient.invalidateQueries({ queryKey: ["employees"] });
        router.push(`/dashboard`);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof employeeSchema>) => {
    setError("");
    setSuccess("");
    mutation.mutate(values);
  };

  return (
    <CardWrapper headerLabel="Invite Employee">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="John Doe"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
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
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="+1 234 567 8900"
                      type="tel"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Position */}
            <FormField
              control={form.control}
              name="position"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Position</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Software Engineer"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Bio */}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief bio..."
                      rows={4}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Joining */}
            <FormField
              control={form.control}
              name="dateOfJoining"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Joining</FormLabel>
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

            {/* Password */}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="••••••••"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="jobtype"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    tell is employee is (remote, onsite, contract)
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={JobType.onsite}>Onsite</SelectItem>
                        <SelectItem value={JobType.remote}>Remote</SelectItem>
                        <SelectItem value={JobType.contract}>
                          Contract
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
                ? "sending invite"
                : "invitation sent successfully"}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
