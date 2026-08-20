import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/getAccessToken";
import { getSupabaseConfig } from "@/lib/supabase/env";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ epicId: string }> },
) {
  try {
    const { epicId } = await params;
    const body = await request.json();

    const { apiUrl, anonKey } = getSupabaseConfig();
    if (!apiUrl || !anonKey) {
      return NextResponse.json(
        { message: "Environment variables are missing." },
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

    const response = await fetch(`${apiUrl}/rest/v1/epics?id=eq.${epicId}`, {
      method: "PATCH",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(body),
    });

    const result = await response.json();

    if (!response.ok) {
      return NextResponse.json(result, {
        status: response.status,
      });
    }

    return NextResponse.json(result, {
      status: 200,
    });
  } catch {
    return NextResponse.json(
      { message: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
