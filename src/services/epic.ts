import { EpicFormValues } from "@/lib/validations/epic";

export async function createEpic(projectId: string, data: EpicFormValues) {
  try {
    const body = {
      ...data,
      project_id: projectId,
      assignee_id: data.assignee_id || null,
      deadline: data.deadline || null,
    };

    const response = await fetch("/api/epic", {
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
        code: result.code,
        details: result.details,
        hint: result.hint,
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
      message: "Connection failed. Please try again in a few moments.",
    };
  }
}
