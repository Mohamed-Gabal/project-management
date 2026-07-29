import { cookies } from "next/headers";

// Read the current authenticated user,s access token from the session cookie
export async function getAccessToken() {
  const cookieStore = await cookies();
  const session = cookieStore.get("supabase_session");

  if (!session) {
    return null;
  }

  const { access_token } = JSON.parse(session.value);
  return access_token;
}
