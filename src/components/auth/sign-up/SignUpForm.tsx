"use client";

import { signUp } from "@/services/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, SignUpFormValues } from "@/lib/validations/sign-up";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import PasswordRequirements from "@/components/auth/sign-up/PasswordRequirements";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const SignUpForm = () => {
  // State to hold any API error messages
  const [apiError, setApiError] = useState("");

  // Initialize the router for navigation after successful signup
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  // Watching the password field live, needed for PasswordRequirements checklist
  const passwordValue = watch("password", "");

  const onSubmit = async (data: SignUpFormValues) => {
    // Clear any previous API error messages
    setApiError("");

    const result = await signUp(data);

    if (!result.ok) {
      setApiError(result.message);
      return;
    }

    router.push("/login");
  };

  return (
    <section className="py-8 sm:p-0">
      <header className="mb-8 text-center">
        <h1 className="text-headline-lg font-bold text-neutral-dark">
          Create your workspace
        </h1>
        <p className="mt-2 text-body-md text-neutral">
          Join the editorial approach to task management.
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Input
          id="name"
          label="NAME"
          placeholder="Enter your full name"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="email"
          label="EMAIL"
          type="email"
          placeholder="yourname@company.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="jobTitle"
          label="JOB TITLE (OPTIONAL)"
          placeholder="e.g. Project Manager"
          error={errors.jobTitle?.message}
          {...register("jobTitle")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordInput
            id="password"
            label="PASSWORD"
            placeholder="Password"
            error={errors.password?.message}
            {...register("password")}
          />

          <PasswordInput
            id="confirmPassword"
            label="CONFIRM PASSWORD"
            placeholder="Repeat your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        </div>

        <PasswordRequirements password={passwordValue} />

        {apiError && (
          <p className="text-center text-body-md text-error">{apiError}</p>
        )}

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <p className="mt-5 text-center text-body-md text-neutral">
        Already have an account?
        <Link href="/login" className="font-bold text-primary">
          Log in
        </Link>
      </p>
    </section>
  );
};
export default SignUpForm;
