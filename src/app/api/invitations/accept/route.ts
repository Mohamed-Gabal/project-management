import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { getAccessToken } from "@/lib/auth/getAccessToken";

export async function POST(request: Request) {
  try {
    // Read request body
    const { token } = await request.json();

    // Validate required data
    if (!token) {
      return NextResponse.json(
        { message: "Invitation token is required" },
        { status: 400 },
      );
    }

    // Get configuration
    const { apiUrl, anonKey } = getSupabaseConfig();

    if (!apiUrl || !anonKey) {
      return NextResponse.json(
        { message: "Environment variables are missing" },
        { status: 500 },
      );
    }

    // Get access token
    const accessToken = await getAccessToken();

    if (!accessToken) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${apiUrl}/rest/v1/rpc/accept_invitation`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_token: token,
      }),
    });

    const text = await response.text();
    const result = text ? JSON.parse(text) : {};

    // Forward Supabase errors
    if (!response.ok) {
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    // Return success
    return NextResponse.json(
      {
        ok: true,
        data: result,
      },
      {
        status: 200,
      },
    );
  } catch {
    return NextResponse.json(
      {
        message: "Unable to accept invitation. Please try again later.",
      },
      {
        status: 500,
      },
    );
  }
}
