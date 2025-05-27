import React, { Suspense } from "react";
import { NewVerificationForm } from "../../../components/Auth/new-verification-form";

export default function NewVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewVerificationForm />
    </Suspense>
  );
}
