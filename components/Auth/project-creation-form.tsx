"use client";

import { Button } from "../ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as z from "zod";
import { createProjectSchema } from "../../schema/index";
import React, { useState } from "react";
import { CardWrapper } from "./card-wrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
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
import { Textarea } from "../ui/textarea";
import { createProject } from "../../actions/project/creation";
import { useRouter } from "next/navigation";

export const ProjectForm = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      detail: "",
      projectType: "",
      mainDeadline: "",
    },
  });

  const mutation = useMutation({
    mutationFn: createProject,
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
        setError(data.error);
        setSuccess(undefined);
        form.reset();
        return;
      }
      if (data?.success) {
        setSuccess(data.success);
        setError(undefined);
        form.reset();

        // Invalidate 'projects' cache to refetch projects list automatically
        queryClient.invalidateQueries({ queryKey: ["projects"] });

        // Navigate to newly created project page
        router.push(`/project/${data.projectId}`);
      }
    },
  });

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    setError("");
    setSuccess("");
    mutation.mutate(values);
  };

  return (
    <CardWrapper headerLabel="Create a project">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Project name"
                      type="text"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detail</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Brief detail about project..."
                      rows={4}
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Project Type (e.g., Web, Mobile, Desktop, API)
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter the type of project"
                      type="text"
                      disabled={mutation.isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mainDeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline of project</FormLabel>
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
          </div>

          <FormError message={error} />
          <FormSuccess message={success} />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Creating..." : "Create a project"}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
