import { z } from "zod";

export const InviteMemberSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email"),
});

export type InviteMemberFormValues = z.infer<typeof InviteMemberSchema>;
