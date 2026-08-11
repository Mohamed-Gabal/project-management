import { getSupabaseConfig } from "@/lib/supabase/env";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/getAccessToken";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  const { apiUrl, anonKey } = getSupabaseConfig();

  if (!apiUrl || !anonKey) {
    return NextResponse.json(
      { message: "Environment variables are missing" },
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

  try {
    const response = await fetch(
      `${apiUrl}/rest/v1/project_epics?project_id=eq.${projectId}`,
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
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    return NextResponse.json(result, {
      status: response.status,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the server." },
      { status: 503 },
    );
  }
}
