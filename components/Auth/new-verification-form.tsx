"use client";

import React, { useCallback, useState, useEffect } from "react";
import { CardWrapper } from "./card-wrapper";
import { BallTriangle } from "react-loader-spinner";
import { useSearchParams } from "next/navigation";
import { newVerification } from "../../actions/new-verification";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";

export function NewVerificationForm() {
  const searchParam = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const token = searchParam.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Missing token!");
      return;
    }
    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong!");
      });
  }, [token, success, error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper headerLabel="Confirming Your verification">
      <div className="flex justify-center items-center w-full">
        {!success && !error && (
          <BallTriangle
            height={50}
            width={50}
            radius={5}
            color="#1A1A1A"
            ariaLabel="ball-triangle-loading"
            wrapperStyle={{}}
            wrapperClass=""
            visible={true}
          />
        )}
        {!success && <FormError message={error} />}
        <FormSuccess message={success} />
        <FormSuccess />
      </div>
    </CardWrapper>
  );
}
