"use client";

import * as z from "zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { SettingSchema } from "../../../schema";
import { setting } from "../../../actions/setting";
import { Card, CardContent, CardHeader } from "../../../components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import { Input } from "../../../components/ui/input";
import { FormSuccess } from "../../../components/form-success";
import { FormError } from "../../../components/form-error";
import { Button } from "../../../components/ui/button";
import { useRouter } from "next/navigation";

const SettingPage = () => {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const router = useRouter();
  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      password: "",
      newPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof SettingSchema>) => {
    setError(undefined);
    setSuccess(undefined);

    startTransition(() => {
      setting(values)
        .then((data) => {
          if (data.error) {
            setError(data.error);
          }
          if (data.success) {
            setSuccess(data.success);
            form.reset();
            router.push("/dashboard");
          }
        })
        .catch(() => setError("Something went wrong!"));
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background  px-4">
      <Card className="w-full max-w-md shadow-md">
        <CardHeader>
          <p className="text-2xl font-semibold text-center">
            🔐 Change Password
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Enter your current password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        placeholder="Enter your new password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormError message={error} />
              <FormSuccess message={success} />
              <Button type="submit" disabled={isPending} className="w-full">
                Update Password
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingPage;
