import { getSupabaseConfig } from "@/lib/supabase/env";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/getAccessToken";

export async function GET(request: Request) {
  // Read Pagination Values From the URL
  const { searchParams } = new URL(request.url);

  const limit = searchParams.get("limit") ?? "10";
  const offset = searchParams.get("offset") ?? "0";

  // Get Supabase configuration
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
      `${apiUrl}/rest/v1/rpc/get_projects?limit=${limit}&offset=${offset}`,
      {
        method: "POST",
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "count=exact",
        },
      },
    );

    const contentRange = response.headers.get("content-range");

    // Extract Total Projects Count From Content-Range Header
    const totalCount = Number(contentRange?.split("/")[1] ?? 0);

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    return NextResponse.json(
      { projects: result, totalCount },
      { status: response.status },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Unable to connect to the server." },
      { status: 503 },
    );
  }
}
