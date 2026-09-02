import { z } from "zod";

const isValidFutureDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date.getTime() >= Date.now();
};

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),

  epic_id: z.string().optional(),

  description: z.string().optional(),

  assignee_id: z.string().optional(),

  due_date: z
    .string()
    .optional()
    .refine(
      (value) => !value || isValidFutureDate(value),
      "Due date must be a valid future date",
    ),

  status: z.enum([
    "TO_DO",
    "IN_PROGRESS",
    "BLOCKED",
    "IN_REVIEW",
    "READY_FOR_QA",
    "REOPENED",
    "READY_FOR_PRODUCTION",
    "DONE",
  ]),
});

// Validation for create task + project_id
export const createTaskSchema = taskSchema.extend({
  project_id: z.string().uuid("Invalid project ID"),
});

export type TaskFormValues = z.infer<typeof taskSchema>;
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

// Validation Schema for partial task updates
export const updateTaskSchema = taskSchema.partial();
