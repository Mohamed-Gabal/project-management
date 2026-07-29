import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";

export async function POST(request: Request) {
  // Read login credentials from the request body
  const { email, password, rememberMe } = await request.json();

  // Get Supabase configuration
  const { apiUrl, anonKey } = getSupabaseConfig();

  if (!apiUrl || !anonKey) {
    return NextResponse.json(
      { message: "Environment variables are missing" },
      { status: 500 },
    );
  }

  const response = await fetch(`${apiUrl}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: anonKey,
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    return NextResponse.json(result, {
      status: response.status,
    });
  }

  // Create the API response
  const res = NextResponse.json(result, {
    status: response.status,
  });

  // Store the authenticated user session in a secure HTTP-only cookie
  res.cookies.set(
    "supabase_session",
    JSON.stringify({
      access_token: result.access_token,
      refresh_token: result.refresh_token,
    }),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 24,
      sameSite: "lax",
      path: "/",
    },
  );

  return res;
}
