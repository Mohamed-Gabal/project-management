import { getAccessToken } from "@/lib/auth/getAccessToken";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const projectId = searchParams.get("projectId");
    const status = searchParams.get("status");

    if (!projectId || !status) {
      return NextResponse.json(
        { message: "projectId and status are required." },
        { status: 400 },
      );
    }

    const { apiUrl, anonKey } = getSupabaseConfig();
    if (!apiUrl || !anonKey) {
      return NextResponse.json(
        { message: "Environment variables are missing." },
        { status: 500 },
      );
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return NextResponse.json(
        { message: "User is not authenticated." },
        { status: 401 },
      );
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
      return NextResponse.json(
        {
          message: "Failed to fetch tasks.",
          details: result,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(result, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
