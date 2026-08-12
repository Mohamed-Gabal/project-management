import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  epic_id: z.string().optional(),
  description: z.string().optional(),
  assignee_id: z.string().optional(),
  due_date: z.string().optional(),
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

export type TaskFormValues = z.infer<typeof taskSchema>;
