import { NextResponse } from "next/server";
import { getProjectMembersFromDB } from "@/services/project.server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  const result = await getProjectMembersFromDB(projectId);

  if (!result.ok) {
    return NextResponse.json(
      { message: result.message },
      { status: result.status },
    );
  }

  return NextResponse.json(result.data, { status: result.status });
}
