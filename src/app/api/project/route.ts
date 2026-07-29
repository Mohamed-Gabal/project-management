import { getSupabaseConfig } from "@/lib/supabase/env";
import { getAccessToken } from "@/lib/auth/getAccessToken";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

  const body = await request.json();

  const response = await fetch(`${apiUrl}/rest/v1/projects`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  }

  return NextResponse.json(
    {
      message: "Project created successfully",
    },
    {
      status: 201,
    },
  );
}
