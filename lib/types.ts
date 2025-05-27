import {
  LeaveType,
  LeaveStatus,
  MainStatus,
  JobType,
  ProjectStatus,
} from "@prisma/client";

export interface User {
  id: string;
  name?: string;
  email?: string;
  image?: string;
  position?: string;
  role?: string;
}

export interface UserProject {
  id: string;
  userId: string;
  projectId: string;
  assignedBy: string;
  employeeDeadline: Date;
  assignedAt: Date;
  updatedAt: Date;
  workDetail: string;
  status: "assigned" | "in_progress" | "completed";
  user: User;
  admin: User;
}

export interface Project {
  id: string;
  name: string;
  detail?: string;
  projectType?: string;
  MainStatus: MainStatus;
  mainDeadline: Date;
  createdAt: Date;
  assignments: UserProject[];
}
export interface AssignedProject {
  employeeDeadline: string;
  projectId: string;
  status: ProjectStatus;

  project: {
    name: string;
  };
}

export interface TimeLog {
  id: string;
  date: string;
  hoursWorked: number;
  userName: string;
  projectName: string;
}
export type Employee = {
  name: string;
  email: string;
  image?: string;
  phone?: string | null;
  position?: string | null;
  bio?: string | null;
  jobtype: JobType;
  assignedProjects: {
    id: string;
    workDetail: string;
    status: string;
    employeeDeadline: string;
    assignedAt: string;
    updatedAt: string;
    project: {
      id: string;
      name: string;
      detail?: string | null;
      mainDeadline: string;
    };
    admin: {
      id: string;
      name: string;
      email: string;
    };
  }[];
  attendances: {
    id: string;
    date: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }[];
};

export type Leave = {
  id: string;
  userId: string;
  reason: string;
  fromDate: Date;
  toDate: Date;
  type: LeaveType;
  status: LeaveStatus;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
  };
};
export type LeaveBalance = {
  id: string;
  userId: string;
  total: number;
  used: number;
  remaining: number;
  user?: {
    id: string;
  };
};
