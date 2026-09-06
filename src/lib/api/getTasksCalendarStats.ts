import { getAccessToken } from "@/lib/auth/getAccessToken";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { tasksCalendarStatsSchema } from "@/lib/validations/statistics";
import type { ApiResult } from "@/types/api";
import type { StatisticsStatus, TasksCalendarStats } from "@/types/statistics";

interface GetTasksCalendarStatsParams {
  startDate: string;
  endDate: string;
  projectId: string | null;
  status: StatisticsStatus | null;
}

export async function getTasksCalendarStats({
  startDate,
  endDate,
  projectId,
  status,
}: GetTasksCalendarStatsParams): Promise<ApiResult<TasksCalendarStats>> {
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
      `${apiUrl}/rest/v1/rpc/get_tasks_calendar_stats`,
      {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_start_date: startDate,
          p_end_date: endDate,
          p_project_id: projectId,
          p_status: status,
        }),
        cache: "no-store",
      },
    );

    const result = await response.json();
    console.log("Calendar Stats Response:", result);
    console.log("Calendar Stats Status:", response.status);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "Failed to fetch calendar statistics.",
        data: result,
      };
    }

    const parsed = tasksCalendarStatsSchema.safeParse(result);

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
