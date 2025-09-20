"use client";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
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
  const [showPassword, setShowPassword] = useState(false);

  // GOOGLE OAUTH SIGN IN / SIGN UP
  const handleGoogleAuth = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/v1/callback`,
        },
      });
    } catch (error) {
      console.error("Google Auth Error:", error);
    }
  };

  const getFriendlyErrorMessage = (error: unknown): string => {
    if (error && typeof error === "object") {
      const errObj = error as { message?: string; status?: number };
      switch (errObj.status) {
        case 400:
          return "Invalid login credentials.";
        case 401:
          return "Unauthorized access.";
        case 429:
          return "Too many requests. Please try again later.";
        default:
          return errObj.message || "An unexpected error occurred.";
      }
    }
    return "An unexpected error occurred.";
  };

  const onSubmit = async (data: FormData) => {
    setFormError(null);

    try {
      if (isSignup) {
        // SIGN UP
        const { data: authData, error: signUpError } =
          await supabase.auth.signUp({
            email: data.email,
            password: data.password,
          });

        if (signUpError) {
          setFormError(getFriendlyErrorMessage(signUpError));
          return;
        }
        if (!authData?.user) {
          setFormError("No user data returned.");
          return;
        }

        router.push("/user/onboarding");
      } else {
        // SIGN IN
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (signInError) {
          setFormError(getFriendlyErrorMessage(signInError));
          return;
        }

        router.push("/");
      }
    } catch (error: unknown) {
      setFormError(getFriendlyErrorMessage(error));
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
        <label htmlFor="email" className="sr-only">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          {...register("email")}
          className="w-full rounded-sm bg-nawalingo-dark/10 px-6 py-4 tracking-wide focus:outline-2 focus:outline-nawalingo-primary dark:bg-nawalingo-light/10 dark:focus:outline-nawalingo-primary"
        />
        {errors.email && (
          <p
            role="alert"
            aria-live="assertive"
            className="mt-1 text-sm text-red-500"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      {/* PASSWORD INPUT */}
      <div className="relative">
        <label htmlFor="password" className="sr-only">
          Password
        </label>
        <input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Password"
          {...register("password")}
          autoComplete={isSignup ? "new-password" : "current-password"}
          className="w-full rounded-sm bg-nawalingo-dark/10 px-6 py-4 pr-14 tracking-wide focus:outline-2 focus:outline-nawalingo-primary dark:bg-nawalingo-light/10 dark:focus:outline-nawalingo-primary"
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute top-1/2 right-4 -translate-y-1/2 text-xl text-nawalingo-dark/50 dark:text-nawalingo-light/50"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
        </button>
        {errors.password && (
          <p
            role="alert"
            aria-live="assertive"
            className="mt-1 text-sm text-red-500"
          >
            {errors.password.message}
          </p>
        )}
      </div>

      {/* ERROR MESSAGE */}
      {formError && (
        <p role="alert" aria-live="assertive" className="text-sm text-red-500">
          {formError}
        </p>
      )}

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
