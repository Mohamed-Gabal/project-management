import { z } from "zod";

export const statisticsStatusEnum = z.enum([
  "TO_DO",
  "IN_PROGRESS",
  "BLOCKED",
  "IN_REVIEW",
  "READY_FOR_QA",
  "REOPENED",
  "READY_FOR_PRODUCTION",
  "DONE",
]);

const statusCountsSchema = z.record(z.string(), z.number());

export const dailyStatisticsSchema = z.object({
  day: z.string(),
  statuses: statusCountsSchema,
});

export const tasksCalendarStatsSchema = z.object({
  daily: z.array(dailyStatisticsSchema),
  totals: statusCountsSchema,
  total_tasks: z.number(),
  done_tasks: z.number(),
  overdue_tasks: z.number(),
});

export const taskCountPerProjectSchema = z.object({
  project_id: z.string(),
  project_name: z.string(),
  tasks_count: z.number(),
});

export const tasksCountPerProjectListSchema = z.array(
  taskCountPerProjectSchema,
);
