import { NewPasswordForm } from "../../../components/Auth/new-password-form";
import React, { Suspense } from "react";

export default function NewPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPasswordForm />;
    </Suspense>
  );
}
