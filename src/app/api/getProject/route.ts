import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  const cookieStore = await cookies();
  const session = cookieStore.get("supabase_session");

  if (!session) {
    return NextResponse.json(
      {
        message: "User is not authenticated.",
      },
      {
        status: 401,
      },
    );
  }

  const { access_token } = JSON.parse(session.value);

  const response = await fetch(`${apiUrl}/rest/v1/rpc/get_projects`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${access_token}`,
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
