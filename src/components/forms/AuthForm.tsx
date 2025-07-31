"use client";
export { AuthMode };
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AuthMode } from "@/constants";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/common/Button";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

interface AuthFormProps {
  mode: AuthMode;
}

interface AuthError {
  message: string;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const isSignup = mode === AuthMode.Signup;
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [formError, setFormError] = useState<string | null>(null);

  // GOOGLE OAUTH SIGN IN / SIGN UP
  const handleGoogleAuth = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  const onSubmit = async (data: FormData) => {
    setFormError(null);

    try {
      if (isSignup) {
        //SIGNUP
        const { data: authData, error: signUpError } =
          await supabase.auth.signUp({
            email: data.email,
            password: data.password,
          });

        if (signUpError) throw signUpError;
        if (!authData?.user) throw new Error("No user data returned");

        router.push("/user/onboarding");
      } else {
        //SIGNIN
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        router.push("/");
      }
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        setFormError((error as AuthError).message);
      } else {
        setFormError("An unexpected error occurred");
      }
    }
  };

  const submitLabel = isSignup ? "Sign Up" : "Sign In";
  const submittingLabel = isSignup ? "Signing up..." : "Signing in...";

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-lg space-y-4"
    >
      {/* EMAIL INPUT */}
      <div>
        <input
          id="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          {...register("email")}
          className="w-full rounded-sm bg-nawalingo-dark/10 px-6 py-4 tracking-wide focus:outline-2 focus:outline-nawalingo-primary dark:bg-nawalingo-light/10 dark:focus:outline-nawalingo-primary"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>

      {/* PASSWORD INPUT */}
      <div>
        <input
          id="password"
          type="password"
          placeholder="Password"
          {...register("password")}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="w-full rounded-sm bg-nawalingo-dark/10 px-6 py-4 pr-14 tracking-wide focus:outline-2 focus:outline-nawalingo-primary dark:bg-nawalingo-light/10 dark:focus:outline-nawalingo-primary"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {formError && <p className="text-sm text-red-500">{formError}</p>}

      {/* SUBMIT BUTTON */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 w-full rounded-sm py-6 text-lg font-extrabold tracking-wide uppercase"
      >
        {isSubmitting ? submittingLabel : submitLabel}
      </Button>

      {/* DIVIDER */}
      <div className="relative flex items-center">
        <span className="flex-grow border-t border-nawalingo-dark/20 dark:border-nawalingo-light/20" />
        <span className="mx-4 text-sm tracking-wider text-nawalingo-dark/50 uppercase dark:text-nawalingo-light/50">
          or
        </span>
        <span className="flex-grow border-t border-nawalingo-dark/20 dark:border-nawalingo-light/20" />
      </div>

      {/* GOOGLE AUTH BUTTON */}
      <Button
        type="button"
        variant="outline"
        disabled={isSubmitting}
        onClick={handleGoogleAuth}
        className="w-full rounded-sm py-6 text-lg font-semibold tracking-wide"
      >
        <FcGoogle className="size-5" />
        {isSignup ? "Sign up with Google" : "Sign in with Google"}
      </Button>

      {/* FOOTER LINK */}
      {isSignup ? (
        <p className="text-center text-sm text-nawalingo-dark/50 dark:text-nawalingo-light/50">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="ml-1 tracking-wider capitalize underline hover:text-nawalingo-primary"
          >
            log in
          </Link>{" "}
          to continue your journey.
        </p>
      ) : (
        <p className="text-center text-sm text-nawalingo-dark/50 dark:text-nawalingo-light/50">
          Don&apos;t have an account?{" "}
          <Link
            href="/auth/signup"
            className="ml-1 tracking-wider capitalize underline hover:text-nawalingo-primary"
          >
            Sign Up
          </Link>{" "}
          and started!
        </p>
      )}
    </form>
  );
}
