export type StatisticsStatus =
  | "TO_DO"
  | "IN_PROGRESS"
  | "BLOCKED"
  | "IN_REVIEW"
  | "READY_FOR_QA"
  | "REOPENED"
  | "READY_FOR_PRODUCTION"
  | "DONE";

export interface DailyStatistics {
  day: string;
  statuses: Partial<Record<StatisticsStatus, number>>;
}

export interface TasksCalendarStats {
  daily: DailyStatistics[];
  totals: Partial<Record<StatisticsStatus, number>>;
  total_tasks: number;
  done_tasks: number;
  overdue_tasks: number;
}

export interface TasksCountPerProject {
  project_id: string;
  project_name: string;
  tasks_count: number;
}
