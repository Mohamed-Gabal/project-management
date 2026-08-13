import { NextResponse } from "next/server";
import { getAccessToken } from "@/lib/auth/getAccessToken";
import { getSupabaseConfig } from "@/lib/supabase/env";
import { createTaskSchema } from "@/lib/validations/task";

export async function POST(request: Request) {
  try {
    // Read Request Body
    const body = await request.json();

    // Validate request body before sending it to Supabase.
    const validation = createTaskSchema.safeParse(body);

    // Return validation errors when the request body does not match the task schema.
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid task data.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

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
    const response = await fetch(`${apiUrl}/rest/v1/tasks`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });

    const result = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          message: "Failed to create task.",
          details: result,
        },
        { status: response.status },
      );
    }

    return NextResponse.json(
      {
        message: "Task created successfully.",
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 },
    );
  }
}
