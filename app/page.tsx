import { Poppins } from "next/font/google";
import LoginButton from "../components/Auth/login-button";
import { Button } from "../components/ui/button";
import { cn } from "../lib/utils";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background  px-4">
      <div className="w-full max-w-md space-y-8 text-center">
        <h1
          className={cn(
            "text-5xl sm:text-6xl font-bold text-primary dark:text-primary-foreground drop-shadow-lg",
            font.className
          )}
        >
          Kodsphere
        </h1>
        <p className="text-white text-lg sm:text-xl tracking-wide">
          Login to your account
        </p>
        <div className="mt-6">
          <LoginButton mode="modal" asChild>
            <Button
              variant="default"
              size="lg"
              className="w-full sm:w-auto px-6 py-3 text-base font-medium "
            >
              Sign in
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
