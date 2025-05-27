"use client";

import React, { Suspense } from "react";
import { EmployeeInProjectFormWrapper } from "../../../components/employeeInProjectFormWrapper";

const EmployeeInProjectPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6">
        <Suspense fallback={<div>Loading form...</div>}>
          <EmployeeInProjectFormWrapper />
        </Suspense>
      </div>
    </div>
  );
};

export default EmployeeInProjectPage;
