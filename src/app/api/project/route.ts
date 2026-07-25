import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
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

  const body = await request.json();

  const response = await fetch(`${apiUrl}/rest/v1/projects`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${access_token}`,
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
