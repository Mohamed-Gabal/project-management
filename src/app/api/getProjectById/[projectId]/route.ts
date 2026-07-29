import { getSupabaseConfig } from "@/lib/supabase/env";
import { getAccessToken } from "@/lib/auth/getAccessToken";
import { NextResponse } from "next/server";

// Fetch a single project by its ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  // Extract the project ID from the route parameters
  const { projectId } = await params;

  // Get Supabase configuration
  const { apiUrl, anonKey } = getSupabaseConfig();

  // Make sure the required environment variables exist
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

  // Read the user's session cookie
  const accessToken = await getAccessToken();

  // Make sure the user is authenticated
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

  // Request the selected project from Supabase using its unique ID
  const response = await fetch(
    `${apiUrl}/rest/v1/projects?id=eq.${projectId}&select=*`,
    {
      method: "GET",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    },
  );

  // Parse the response returned from Supabase
  const result = await response.json();

  // Return the error response if the request failed
  if (!response.ok) {
    return NextResponse.json(result, {
      status: response.status,
    });
  }

  // Return the requested project
  return NextResponse.json(result[0], {
    status: response.status,
  });
}
