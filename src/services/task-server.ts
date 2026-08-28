import { getAccessToken } from "@/lib/auth/getAccessToken";
import { getSupabaseConfig } from "@/lib/supabase/env";

// Get tasks for a specific status using limit and offset pagination
export async function getTasksByStatus(
  projectId: string,
  status: string,
  limit: number,
  offset: number,
) {
  try {
    const { apiUrl, anonKey } = getSupabaseConfig();

    if (!apiUrl || !anonKey) {
      return {
        ok: false,
        status: 500,
        message: "Environment variables are missing.",
      };
    }

    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        ok: false,
        status: 401,
        message: "User is not authenticated.",
      };
    }

    // Get the tasks for the selected status using pagination
    // limit controls how many tasks are returned
    // offset controls where the returned tasks start from
    const params = new URLSearchParams({
      project_id: `eq.${projectId}`,
      status: `eq.${status}`,
      limit: String(limit),
      offset: String(offset),
    });

    const response = await fetch(
      `${apiUrl}/rest/v1/project_tasks?${params.toString()}`,
      {
        method: "GET",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      },
    );

    const result = await response.json();
    const contentRange = response.headers.get("Content-Range");

    // Extract the total number of tasks from the Content-Range response header
    const totalCount = contentRange ? Number(contentRange.split("/")[1]) : 0;

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "Failed to fetch tasks.",
        data: result,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: result,
      totalCount,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Connection failed. Please try again.",
    };
  }
}

// Get all project tasks for List View using limit and offset pagination
export async function getTasks(
  projectId: string,
  limit: number,
  offset: number,
) {
  try {
    const { apiUrl, anonKey } = getSupabaseConfig();

    if (!apiUrl || !anonKey) {
      return {
        ok: false,
        status: 500,
        message: "Environment variables are missing.",
      };
    }

    const accessToken = await getAccessToken();

    if (!accessToken) {
      return {
        ok: false,
        status: 401,
        message: "User is not authenticated.",
      };
    }

    const params = new URLSearchParams({
      project_id: `eq.${projectId}`,
      limit: String(limit),
      offset: String(offset),
    });

    const response = await fetch(
      `${apiUrl}/rest/v1/project_tasks?${params.toString()}`,
      {
        method: "GET",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      },
    );

    const result = await response.json();
    const contentRange = response.headers.get("Content-Range");

    // Extract the total number of tasks from the Content-Range response header
    const totalCount = contentRange ? Number(contentRange.split("/")[1]) : 0;

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "Failed to fetch tasks.",
        data: result,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: result,
      totalCount,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Connection failed. Please try again.",
    };
  }
}
