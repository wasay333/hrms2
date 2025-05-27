import React from "react";
import { AttendenceForm } from "../../../components/Auth/attendanceForm";

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6">
        <AttendenceForm />
      </div>
    </div>
  );
};

export default page;
