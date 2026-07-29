import { getAccessToken } from "@/lib/auth/getAccessToken";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  // Extract project ID from route params
  const { projectId } = await params;

  // Read request body
  const body = await request.json();

  // Get Supabase configuration
  const { apiUrl, anonKey } = getSupabaseConfig();

  // Validate environment variables
  if (!apiUrl || !anonKey) {
    return NextResponse.json(
      {
        message: "Environment variables are missing",
      },
      {
        status: 500,
      },
    );
  }

  // Read session cookie
  const accessToken = await getAccessToken();
  // Check authentication
  if (!accessToken) {
    return NextResponse.json(
      {
        message: "User is not authenticated.",
      },
      {
        status: 401,
      },
    );
  }

  // Send the update request to Supabase
  const response = await fetch(
    `${apiUrl}/rest/v1/projects?id=eq.${projectId}`,
    {
      method: "PATCH",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  // Return any error from Supabase
  if (!response.ok) {
    const result = await response.json();
    return NextResponse.json(result, {
      status: response.status,
    });
  }

  // Return the updated project
  return NextResponse.json(
    {
      message: "Project updated successfully",
    },
    {
      status: 200,
    },
  );
}
