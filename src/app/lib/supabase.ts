import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://agcmykfvgrsghljzfcei.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnY215a2Z2Z3JzZ2hsanpmY2VpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MDczMDUsImV4cCI6MjEwMjI4MzMwNX0.FQ7_zduFrSreqIZJH-KbwZdqFyohIbvqfViUoI4B7q0";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
});

/** True only when a REAL Supabase session exists (JWT signed by server). */
export async function isAdminSession(): Promise<boolean> {
  const { data } = await supabase.auth.getSession();
  return !!data.session?.user;
}
