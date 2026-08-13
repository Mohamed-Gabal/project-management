import { TaskFormValues } from "@/lib/validations/task";

export async function createTask(projectId: string, data: TaskFormValues) {
  try {
    const body = {
      ...data,
      project_id: projectId,
      epic_id: data.epic_id || null,
      description: data.description || null,
      assignee_id: data.assignee_id || null,
      due_date: data.due_date || null,
    };

    const response = await fetch("/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: result.message,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: result,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Connection failed. Please try again.",
    };
  }
}
