import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { getAccessToken } from "@/lib/auth/getAccessToken";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string; epicId: string }> },
) {
  const { projectId, epicId } = await params;

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

  try {
    const response = await fetch(
      `${apiUrl}/rest/v1/project_epics?id=eq.${epicId}&project_id=eq.${projectId}`,
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
          message: "Failed to fetch epic details.",
          details: result,
        },
        { status: response.status },
      );
    }

    if (!result.length) {
      return NextResponse.json({ message: "Epic not found." }, { status: 404 });
    }

    return NextResponse.json(result[0], {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { message: "Unable to connect to the server." },
      { status: 503 },
    );
  }
}
