import React from "react";
import { AdminInviteForm } from "../../../components/Auth/admin-invite";

const page = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md p-6">
        <AdminInviteForm />
      </div>
    </div>
  );
};

export default page;
