"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type FormData = z.infer<typeof schema>;

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    setFormError(null);
    setSuccess(false);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setFormError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => {
        router.push("/onboarding");
      }, 1500);
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
      {success && (
        <p className="text-sm text-green-600">
          Check your email for a confirmation link.
        </p>
      )}
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "Signing up..." : "Sign Up"}
      </Button>
      <p className="capitalize">
        already have an account? <Link href="/signin">Login</Link>
      </p>
    </form>
  );
}
