"use client";
import { useRouter } from "next/navigation";
import React from "react";

interface SettingButtonProps {
  children?: React.ReactNode;
}
export default function SettingButton({ children }: SettingButtonProps) {
  const router = useRouter();

  const onClick = () => {
    router.push("/setting");
  };
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
}
