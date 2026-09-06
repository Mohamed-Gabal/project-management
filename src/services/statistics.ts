import { getAccessToken } from "@/lib/auth/getAccessToken";
import { getSupabaseConfig } from "@/lib/supabase/env";
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
}: GetTasksCalendarStatsParams) {
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

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        message: "Failed to fetch calendar statistics.",
        data: result,
      };
    }

    return {
      ok: true,
      status: response.status,
      data: result as TasksCalendarStats,
    };
  } catch {
    return {
      ok: false,
      status: 0,
      message: "Connection failed. Please try again.",
    };
  }
}
