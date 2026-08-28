"use server";

import { getTasksByStatus, getTasks } from "@/services/task-server";

// Fetch the next page of tasks for a status column on the board (Board View)
export async function loadMoreTasks(
  projectId: string,
  status: string,
  limit: number,
  offset: number,
) {
  return getTasksByStatus(projectId, status, limit, offset);
}

// Fetch the next page of tasks for the flat task list (Mobile infinite scroll)
export async function loadMoreListTasks(
  projectId: string,
  limit: number,
  offset: number,
) {
  return getTasks(projectId, limit, offset);
}
