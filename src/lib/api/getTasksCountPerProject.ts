import { getAccessToken } from "@/lib/auth/getAccessToken";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { tasksCountPerProjectListSchema } from "@/lib/validations/statistics";
import type { ApiResult } from "@/types/api";
import type { TasksCountPerProject } from "@/types/statistics";

interface GetTasksCountPerProjectParams {
  startDate: string;
  endDate: string;
}

export async function getTasksCountPerProject({
  startDate,
  endDate,
}: GetTasksCountPerProjectParams): Promise<ApiResult<TasksCountPerProject[]>> {
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
      return { ok: false, status: 401, message: "User is not authenticated." };
    }

    const response = await fetch(
      `${apiUrl}/rest/v1/rpc/get_tasks_count_per_project`,
      {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_start_date: startDate, p_end_date: endDate }),
        cache: "no-store",
      },
    );

    const result = await response.json();
    console.log("Projects Stats Response:", result);
    console.log("Projects Stats Status:", response.status);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "Failed to fetch tasks count per project.",
        data: result,
      };
    }

    const parsed = tasksCountPerProjectListSchema.safeParse(result);

    if (!parsed.success) {
      return {
        ok: false,
        status: 502,
        message: "Unexpected response shape from server.",
        data: parsed.error.flatten(),
      };
    }

    return { ok: true, status: response.status, data: parsed.data };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Connection failed. Please try again.",
    };
  }
}
