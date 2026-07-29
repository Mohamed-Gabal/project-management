// Read and validate Supabase environment variables

export function getSupabaseConfig() {
  const apiUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return {
    apiUrl,
    anonKey,
  };
}
