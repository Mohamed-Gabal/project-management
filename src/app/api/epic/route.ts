import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/getAccessToken";
import { getSupabaseConfig } from "@/lib/supabase/env";

export async function POST(request: Request) {
  try {
    // Read Request Body
    const body = await request.json();

    // Get Supabase Configuration
    const { apiUrl, anonKey } = getSupabaseConfig();

    // Validation environment Variables
    if (!apiUrl || !anonKey) {
      return NextResponse.json(
        { message: "Environment variables are missing." },
        { status: 500 },
      );
    }

    // Read Session Cookie
    const accessToken = await getAccessToken();

    // Check Authentication
    if (!accessToken) {
      return NextResponse.json(
        { message: "User is not authenticated." },
        { status: 401 },
      );
    }

    // Send Request To Supabase
    const response = await fetch(`${apiUrl}/rest/v1/epics`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    });

    // Handle Supabase errors
    if (!response.ok) {
      const result = await response.json();

      return NextResponse.json(result, {
        status: response.status,
      });
    }

    // Return created epic
    const result = await response.json();

    return NextResponse.json(result, {
      status: 201,
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
