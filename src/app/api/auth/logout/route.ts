import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { getAccessToken } from "@/lib/auth/getAccessToken";
import { cookies } from "next/headers";

export async function POST() {
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

  const response = await fetch(`${apiUrl}/auth/v1/logout`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const result = await response.json();

    return NextResponse.json(result, {
      status: response.status,
    });
  }

  // logout request to Supabase
  const cookieStore = await cookies();
  cookieStore.delete("supabase_session");

  return NextResponse.json(
    {
      message: "Logged out successfully.",
    },
    {
      status: 200,
    },
  );
}
