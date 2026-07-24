export async function createProject(data: ProjectFormValues) {
  try {
    const response = await fetch("/api/project", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    if (!response.ok) {
      return {
        ok: false,
        message: result.message,
        code: result.code,
        details: result.details,
        hint: result.hint,
      };
    }

    return {
      ok: true,
      data: result,
    };
  } catch {
    return {
      ok: false,
      message: "Unable to connect. Please try again later.",
    };
  }
}
