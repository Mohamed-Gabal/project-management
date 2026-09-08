import { z } from "zod";
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_RULES,
} from "./password-rules";

const nameRegex = /^\p{L}+(?: \p{L}+)*$/u;

export const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Name is required")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name must not exceed 50 characters")
      .regex(
        nameRegex,
        "Name must contain letters only (single spaces allowed between parts)",
      ),

    email: z
      .string()
      .trim()
      .min(1, "Email is required")
      .email("Invalid email format"),

    jobTitle: z.string().trim().optional(),

    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, "Password must be at least 8 characters")
      .max(PASSWORD_MAX_LENGTH, "Password must not exceed 64 characters")
      .regex(PASSWORD_RULES.noWhitespace, "Password must not contain spaces")
      .regex(
        PASSWORD_RULES.uppercase,
        "Must contain at least one uppercase letter",
      )
      .regex(
        PASSWORD_RULES.lowercase,
        "Must contain at least one lowercase letter",
      )
      .regex(PASSWORD_RULES.digit, "Must contain at least one digit")
      .regex(
        PASSWORD_RULES.specialChar,
        "Must contain at least one special character",
      ),

    confirmPassword: z.string().min(1, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpSchema>;
