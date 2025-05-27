import { LeaveType, UserRole, JobType } from "@prisma/client";
import { addDays, isBefore, isValid, parseISO, startOfDay } from "date-fns";
import * as z from "zod";

export const assignProjectSchema = z.object({
  workDetail: z
    .string()
    .min(1, "Work detail is required")
    .max(1000, "Work detail must be under 1000 characters"),
  employeeDeadline: z
    .string()
    .min(1, "Deadline is required")
    .refine((val) => isValid(parseISO(val)), {
      message: "Invalid deadline format",
    })
    .refine(
      (val) => {
        const parsedDate = parseISO(val);
        return !isBefore(startOfDay(parsedDate), startOfDay(new Date()));
      },
      {
        message: "Date cannot be in the past",
      }
    ),
});
export const todayWorkSchema = z.object({
  task: z.string().min(1, "Task or queries is required before submitting"),
});

export const TimeLogFormSchema = z.object({
  projectId: z.string().uuid({ message: "Please select a valid project." }),
  date: z
    .string()
    .min(1, "Date is required")
    .refine((val) => isValid(parseISO(val)), {
      message: "Invalid date format",
    })
    .refine(
      (val) => {
        const parsedDate = parseISO(val);
        return !isBefore(startOfDay(parsedDate), startOfDay(new Date()));
      },
      {
        message: "Date cannot be in the past",
      }
    ),
  hoursWorked: z
    .string({ required_error: "Hours worked is required." })
    .min(0.25, "Minimum 0.25 hours required.")
    .max(24, "Cannot log more than 24 hours."),
});

export const employeeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  role: z.enum([UserRole.EMPLOYEE]),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().optional(),
  password: z.string().min(6, "Password must be at least 8 characters"),
  bio: z.string().optional(),
  jobtype: z.nativeEnum(JobType, {
    errorMap: () => ({ message: "Invalid job type" }),
  }),
  dateOfJoining: z
    .string()
    .min(1, "Date of joining is required")
    .refine((val) => isValid(parseISO(val)), {
      message: "Invalid date format",
    })
    .refine(
      (val) => {
        const parsedDate = parseISO(val);
        return !isBefore(startOfDay(parsedDate), startOfDay(new Date()));
      },
      {
        message: "Date cannot be in the past",
      }
    ),
});
export const createAttendanceSchema = z.object({
  confirm: z
    .boolean({
      required_error: "You must confirm attendance",
      invalid_type_error: "You must confirm attendance",
    })
    .refine((val) => val === true, {
      message: "You must confirm attendance",
    }),
  date: z
    .string()
    .min(1, "Date is required")
    .refine(
      (val) => {
        const parsedDate = parseISO(val);
        return isValid(parsedDate);
      },
      {
        message: "Invalid date format",
      }
    )
    .refine(
      (val) => {
        const parsedDate = parseISO(val);
        return !isBefore(startOfDay(parsedDate), startOfDay(new Date()));
      },
      {
        message: "Date cannot be in the past",
      }
    ),
});
export const createLeaveRequestSchema = z
  .object({
    reason: z.string().min(1, "Reason is required"),
    fromDate: z
      .string()
      .min(1, "From date is required")
      .refine((val) => isValid(parseISO(val)), {
        message: "Invalid date format",
      })
      .refine(
        (val) => {
          const parsedDate = parseISO(val);
          const tomorrow = addDays(startOfDay(new Date()), 1);
          return !isBefore(parsedDate, tomorrow);
        },
        {
          message: "From date must be at least one day after today",
        }
      ),
    toDate: z
      .string()
      .min(1, "To date is required")
      .refine((val) => isValid(parseISO(val)), {
        message: "Invalid date format",
      }),
    type: z.nativeEnum(LeaveType, {
      errorMap: () => ({ message: "Invalid leave type" }),
    }),
  })
  .refine(
    (data) => {
      // Only run this validation if both dates are valid
      if (
        !isValid(parseISO(data.fromDate)) ||
        !isValid(parseISO(data.toDate))
      ) {
        return true; // Let the individual field validations handle format errors
      }

      const fromDate = parseISO(data.fromDate);
      const toDate = parseISO(data.toDate);

      // toDate can be equal to or after fromDate, but not before
      return !isBefore(toDate, fromDate);
    },
    {
      message: "End date cannot be before start date",
      path: ["toDate"], // This shows the error on the toDate field
    }
  );
export const createProjectSchema = z.object({
  name: z.string().min(1, { message: "Project name is required" }),
  detail: z.string().optional(),
  projectType: z.string().optional(),
  mainDeadline: z
    .string()
    .min(1, "Date is required")
    .refine(
      (val) => {
        const parsedDate = parseISO(val);
        return isValid(parsedDate);
      },
      {
        message: "Invalid date format",
      }
    )
    .refine(
      (val) => {
        const parsedDate = parseISO(val);
        return !isBefore(startOfDay(parsedDate), startOfDay(new Date()));
      },
      {
        message: "Date cannot be in the past",
      }
    ),
});
export const updateProjectSchema = z.object({
  detail: z.string().min(10, { message: "Project detail is required" }),
  projectType: z.string().min(1, { message: "Project type is required" }),
});

export const employeeUpdateSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  position: z.string().min(1, { message: "Position is required" }),
  bio: z.string().min(1, { message: "Bio is required" }),
});

export const SettingSchema = z
  .object({
    password: z.string().min(6, "Current password is required."),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters."),
  })
  .refine((data) => data.password !== data.newPassword, {
    message: "New password must be different from current password.",
    path: ["newPassword"],
  });
export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "password is required",
  }),
});
export const RegisterSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Email is required",
  }),
  password: z.string().min(1, {
    message: "password is required",
  }),
});
export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required",
  }),
});
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum of 6 character required",
  }),
});
