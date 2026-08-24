import { getSupabaseConfig } from "@/lib/supabase/env";
import { getAccessToken } from "@/lib/auth/getAccessToken";
import { ProjectMember } from "@/types/member";

type GetProjectMembersResult =
  | { ok: true; status: number; data: ProjectMember[] }
  | { ok: false; status: number; message: string };

export async function getProjectMembersFromDB(
  projectId: string,
): Promise<GetProjectMembersResult> {
  const { apiUrl, anonKey } = getSupabaseConfig();

  if (!apiUrl || !anonKey) {
    return {
      ok: false,
      status: 500,
      message: "Environment variables are missing",
    };
  }

  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { ok: false, status: 401, message: "User is not authenticated." };
  }

  try {
    const response = await fetch(
      `${apiUrl}/rest/v1/get_project_members?project_id=eq.${projectId}`,
      {
        method: "GET",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      },
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: result.message ?? "Request failed",
      };
    }

    return { ok: true, status: response.status, data: result };
  } catch {
    return {
      ok: false,
      status: 503,
      message: "Unable to connect to the server.",
    };
  }
}
