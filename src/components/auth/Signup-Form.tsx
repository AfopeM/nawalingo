"use client";
import { z } from "zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

interface AuthError {
  message: string;
}

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setFormError(null);

    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp(
        {
          email: data.email,
          password: data.password,
        },
      );

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("No user data returned");

      // Redirect to onboarding
      router.push("/onboarding");
    } catch (error: unknown) {
      if (error && typeof error === "object" && "message" in error) {
        setFormError((error as AuthError).message);
      } else {
        setFormError("An unexpected error occurred");
      }
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-sm space-y-4"
    >
      <div>
        <label htmlFor="email" className="mb-1 block">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          className="w-full rounded border px-3 py-2"
          autoComplete="email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label htmlFor="password" className="mb-1 block">
          Password
        </label>
        <input
          id="password"
          type="password"
          {...register("password")}
          className="w-full rounded border px-3 py-2"
          autoComplete="new-password"
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      {formError && <p className="text-sm text-red-500">{formError}</p>}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </Button>
      <p className="text-sm">
        Already have an account? <Link href="/signin">Sign in</Link>
      </p>
    </form>
  );
}
