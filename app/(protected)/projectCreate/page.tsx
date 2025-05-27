import React from "react";
import { ProjectForm } from "../../../components/Auth/project-creation-form";

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6">
        <ProjectForm />
      </div>
    </div>
  );
};

export default page;
