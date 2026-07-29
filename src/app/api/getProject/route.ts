import { getSupabaseConfig } from "@/lib/supabase/env";
import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/getAccessToken";

export async function GET(request: Request) {
  // Get Supabase configuration
  const { apiUrl, anonKey } = getSupabaseConfig();

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

  const accessToken = await getAccessToken();

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

  const response = await fetch(`${apiUrl}/rest/v1/rpc/get_projects`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const result = await response.json();

  if (!response.ok) {
    return NextResponse.json(result, {
      status: response.status,
    });
  }

  return NextResponse.json(result, {
    status: response.status,
  });
}
