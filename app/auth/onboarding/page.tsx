import React, { Suspense } from "react";
import { OnboardingForm } from "../../../components/Auth/onboarding-form";

export default function NewVerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OnboardingForm />;
    </Suspense>
  );
}
