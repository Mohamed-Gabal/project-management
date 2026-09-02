"use server";

import {
  getTasksByStatus,
  getTasks,
  getTaskById,
  updateTaskById,
  TaskUpdatePayload,
} from "@/services/task-server";

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

// Update only the changed fields of a task
export async function UpdateTaskDetails(
  taskId: string,
  updates: Partial<TaskUpdatePayload>,
) {
  return updateTaskById(taskId, updates);
}

// Show the Detail Popup
export async function loadTaskDetails(projectId: string, taskId: string) {
  return getTaskById(projectId, taskId);
}
