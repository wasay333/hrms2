"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useTransition } from "react";
import { CardWrapper } from "../components/Auth/card-wrapper";
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
import { createLeaveRequestSchema } from "../schema";
import { createLeaveRequest } from "../actions/leave/creation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { LeaveType } from "@prisma/client";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof createLeaveRequestSchema>;

export function LeaveForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<FormData>({
    resolver: zodResolver(createLeaveRequestSchema),
    defaultValues: {
      fromDate: "",
      toDate: "",
      reason: "",
      type: "casual",
    },
  });

  const onSubmit = (values: FormData) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      createLeaveRequest(values).then((data) => {
        console.log("create leave request response:", data);
        if (data?.error) {
          setError(data.error);
        } else if (data?.success && data.leaveRequestId) {
          setSuccess(data.success);
          router.push(`/leave/${data.leaveRequestId}`);
        }
      });
    });
  };

  return (
    <CardWrapper headerLabel="Apply for leave">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* reason */}
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>reason</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="give a reason"
                      rows={3}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Start of leave */}
            <FormField
              control={form.control}
              name="fromDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start of leave</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* end of leave */}
            <FormField
              control={form.control}
              name="toDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End of leave</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave Type</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={LeaveType.casual}>
                          Casual Leave
                        </SelectItem>
                        <SelectItem value={LeaveType.medical}>
                          Medical Leave
                        </SelectItem>
                        <SelectItem value={LeaveType.half_leave}>
                          half Leave
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
            <Button type="submit" className="w-full" disabled={isPending}>
              Submit request{" "}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
