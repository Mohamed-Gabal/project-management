import { NextResponse } from "next/server";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { getAccessToken } from "@/lib/auth/getAccessToken";

export async function POST(request: Request) {
  try {
    // Read request body
    const { email, projectId } = await request.json();

    // Validate required data
    if (!email || !projectId) {
      return NextResponse.json(
        { message: "Email and project ID are required" },
        { status: 400 },
      );
    }

    // Get Supabase configuration
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

    const response = await fetch(`${apiUrl}/rest/v1/rpc/invite_member`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_email: email,
        p_project_id: projectId,
        p_app_url: process.env.NEXT_PUBLIC_APP_URL,
        p_base_url: apiUrl,
      }),
    });

    const text = await response.text();
    const result = text ? JSON.parse(text) : {};

    if (!response.ok) {
      return NextResponse.json(result, {
        status: response.status,
      });
    }

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
      { message: "Unable to send invitation. Please try again later." },
      { status: 500 },
    );
  }
}
