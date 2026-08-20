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

// Fetch epic details by project ID and epic ID.
export async function getEpicDetails(projectId: string, epicId: string) {
  try {
    const response = await fetch(`/api/getEpicDetails/${projectId}/${epicId}`);

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: result.message,
        details: result.details,
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

// Fetch tasks belonging to a specific epic
export async function getEpicTasks(epicId: string) {
  try {
    const response = await fetch(`/api/getProjectTasks/${epicId}`);

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
      message: "Connection failed. Please try again in a few moments.",
    };
  }
}

// Update Epic
export async function updateEpic(
  epicId: string,
  data: Partial<EpicFormValues>,
) {
  try {
    const response = await fetch(`/api/epic/${epicId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: result.message,
        details: result.details,
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
