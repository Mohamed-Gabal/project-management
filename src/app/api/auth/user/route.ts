import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { getAccessToken } from "@/lib/auth/getAccessToken";

export async function GET() {
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
        message: "No session found",
      },
      {
        status: 401,
      },
    );
  }

  const response = await fetch(`${apiUrl}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const user = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      {
        message: "Failed to get user",
      },
      {
        status: response.status,
      },
    );
  }

  return NextResponse.json(user);
}
