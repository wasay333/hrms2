"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createAttendanceSchema } from "../../schema/index";
import { useState, useTransition } from "react";
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
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { Button } from "../ui/button";

import { Checkbox } from "../ui/checkbox";
import { createAttendance } from "../../actions/attendence/creation";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof createAttendanceSchema>;

export function AttendenceForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const form = useForm<FormData>({
    resolver: zodResolver(createAttendanceSchema),
    defaultValues: {
      date: "",
      confirm: false,
    },
  });

  const onSubmit = (values: FormData) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      createAttendance(values).then((data) => {
        if (data?.error) {
          setError(data.error);
          return;
        }

        if (data?.success) {
          setSuccess(data.success);
          // Redirect to dashboard after a short delay (optional UX)
          setTimeout(() => {
            router.push("/dashboard");
          }, 1000); // Delay 1 second for UX feedback, or remove if not needed
        }
      });
    });
  };

  return (
    <CardWrapper headerLabel="Mark your attendence">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            {/* CheckIn */}
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormLabel>Mark Attendance</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date*/}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>today date</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* status */}

            {/* Feedback Messages */}
            <FormError message={error} />
            <FormSuccess message={success} />

            {/* Submit */}
            <Button type="submit" className="w-full" disabled={isPending}>
              submit
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
}
