"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { Button } from "./ui/button";
import { assignProjectSchema } from "../schema";
import { CardWrapper } from "./Auth/card-wrapper";
import { assignEmployeeToProject } from "../actions/employee/assignToProject";
import { useRouter } from "next/navigation";

interface EmployeeInProjectFormProps {
  projectId: string;
  userId: string;
}
type FormData = z.infer<typeof assignProjectSchema>;
export function EmployeeInProjectForm({
  projectId,
  userId,
}: EmployeeInProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<FormData>({
    resolver: zodResolver(assignProjectSchema),
    defaultValues: {
      workDetail: "",
      employeeDeadline: "",
    },
  });

  const onSubmit = (values: FormData) => {
    setError("");
    setSuccess("");
    startTransition(() => {
      assignEmployeeToProject({ projectId, userId, values }).then((data) => {
        if (data.error) {
          setError(data.error);
          setSuccess("");
        } else {
          setError("");
          setSuccess(data.success);

          // Redirect to the project page (replace with actual route)
          router.push(`/project/${projectId}`);
        }
      });
    });
  };

  return (
    <CardWrapper headerLabel="Add Employee to project">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="workDetail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>give the detail of what he/she would do</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder="check for bugs in portfolio"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="employeeDeadline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deadline for employee</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Feedback Messages */}
            <FormError message={error} />
            <FormSuccess message={success} />

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isPending}>
              add employee to project
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
