import { createServerSupabaseClient } from '@/lib/supabase/server';

export async function getAdminContext() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) return null;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError) throw profileError;
  if (profile?.role !== 'admin') return null;

  return { supabase, user };
}
