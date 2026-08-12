import { ProjectFormValues } from "@/lib/validations/project";
import { asyncWrapProviders } from "async_hooks";

// Create
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

// Fetch all projects for the authenticated user
export async function getProjects(limit: number, offset: number) {
  const response = await fetch(
    `/api/getProject?limit=${limit}&offset=${offset}`,
  );

  const result = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: result.message,
      code: result.code,
    };
  }

  return {
    status: response.status,
    ok: true,
    data: result.projects,
    totalCount: result.totalCount,
  };
}

// Fetch a single project using its unique project ID
export async function getProjectId(projectId: string) {
  if (!projectId) return;
  const response = await fetch(`/api/getProjectById/${projectId}`);

  // Parse the JSON response returned from the API
  const result = await response.json();

  // Check if the API request failed
  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: result.message,
      code: result.code,
    };
  }

  // Return the project data when the request succeeds
  return {
    ok: true,
    status: response.status,
    data: result,
  };
}

// Update an existing project
export async function updateProject(
  projectId: string,
  data: ProjectFormValues,
) {
  const response = await fetch(`/api/project/${projectId}`, {
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
    };
  }

  return {
    ok: true,
    status: response.status,
    data: result,
  };
}

// Fetch all epic for a specific project
export async function getProjectEpic(projectId: string) {
  const response = await fetch(`/api/getProjectEpics/${projectId}`);

  const result = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: result.message,
      code: result.code,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: result,
  };
}

//
export async function getProjectMembers(projectId: string) {
  const response = await fetch(`/api/getProjectMembers/${projectId}`);

  const result = await response.json();

  if (!response.ok) {
    return {
      ok: false,
      status: response.status,
      message: result.message,
      code: result.code,
    };
  }

  return {
    ok: true,
    status: response.status,
    data: result,
  };
}
