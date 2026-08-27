import { getAccessToken } from "@/lib/auth/getAccessToken";
import { getSupabaseConfig } from "@/lib/supabase/env";

// Get Tasks By Status
export async function getTasksByStatus(projectId: string, status: string) {
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

    const response = await fetch(
      `${apiUrl}/rest/v1/project_tasks?project_id=eq.${projectId}&status=eq.${status}`,
      {
        method: "GET",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      },
    );

    const result = await response.json();

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
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Connection failed. Please try again.",
    };
  }
}
