"use client";
import { DialogContent, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Dialog } from "../ui/dialog";
import { useRouter } from "next/navigation";
import { LoginForm } from "./login-form";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface LoginButtonProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

const LoginButton = ({
  children,
  mode = "redirect",
  asChild,
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => {
    router.push("/auth/login");
  };
  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <DialogTitle>
            <VisuallyHidden>Login</VisuallyHidden>
          </DialogTitle>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }
  return (
    <span onClick={onClick} className="cursor-pointer">
      {children}
    </span>
  );
};

export default LoginButton;
