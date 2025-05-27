import React from "react";
import { LeaveForm } from "../../../components/leaveForm";

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6">
        <LeaveForm />
      </div>
    </div>
  );
};

export default page;
