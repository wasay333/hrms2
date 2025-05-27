import React from "react";

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      {children}
    </div>
  );
};

export default AuthLayout;
