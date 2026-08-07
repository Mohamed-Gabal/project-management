import { z } from "zod";

export const EpicSchema = z.object({
  title: z
    .string()
    .min(3, "Epic title must be at least 3 characters.")
    .max(100, "Epic title must not exceed 100 characters."),

  description: z
    .string()
    .max(500, "Description must not exceed 500 characters.")
    .optional(),

  assignee_id: z.string().optional(),

  deadline: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        return new Date(value) >= today;
      },
      {
        message: "Deadline must be today or a future date.",
      },
    ),
});

export type EpicFormValues = z.infer<typeof EpicSchema>;
