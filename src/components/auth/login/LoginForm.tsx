"use client";

import { login } from "@/services/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormValues, LoginSchema } from "@/lib/validations/login";

import Link from "next/link";
import Input from "../../ui/Input";
import PasswordInput from "../../ui/PasswordInput";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
const LoginForm = () => {
  // State to hold any APÍ error messages
  const [apiError, setApiError] = useState("");

  // Initialize the router for navigation after successful login
  const router = useRouter();

  // Read the redirect target (if the user was sent here from another page)
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");

  // Handle form submission
  const onSubmit = async (data: LoginFormValues) => {
    // Clear any previous API error messages
    setApiError("");

    const result = await login(data);

    if (!result.ok) {
      setApiError(result.message);
      return;
    }

    router.push(redirectTo || "/project");
  };

  // Initialize the form using react-hook-form and zod for validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(LoginSchema),
  });

  return (
    <section className="flex flex-col">
      <header className="text-center">
        <h1 className="text-headline-lg font-bold tracking-headline-lg text-neutral-dark text-center">
          Welcome Back
        </h1>
        <p className="mt-2 text-body-md text-neutral text-center">
          Please enter your details to access your workspace
        </p>
      </header>

      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="mt-8 space-y-4"
      >
        <Input
          id="email"
          label="EMAIL"
          type="email"
          placeholder="yourname@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <PasswordInput
          id="password"
          label="PASSWORD"
          type="password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Remember me and Forgot password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-body-md text-neutral cursor-pointer">
            <input
              type="checkbox"
              className=" h-5 w-5 rounded border-neutral-light accent-primary cursor-pointer"
              {...register("rememberMe")}
            />
            Remember Me
          </label>
          <Link
            href="/project"
            className="text-body-md font-medium text-primary hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* API Error Message */}
        {apiError && (
          <p className="text-center text-body-md text-error">{apiError}</p>
        )}
        <button
          disabled={isSubmitting}
          type="submit"
          className="mt-6 h-12 w-full rounded-lg bg-primary font-semibold text-white transition hover:bg-primary-container cursor-pointer"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-10 text-center text-body-md text-neutral">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="font-bold text-primary">
          Sign up
        </Link>
      </p>
    </section>
  );
};
export default LoginForm;
