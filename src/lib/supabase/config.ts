export function getSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL belum diisi di .env.local.');
  }
  if (!key) {
    throw new Error(
      'Isi NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY atau NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local.',
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL bukan URL yang valid. Salin Project URL dari Supabase, biasanya berbentuk https://<project-ref>.supabase.co.',
    );
  }

  if (parsedUrl.protocol !== 'https:' && parsedUrl.protocol !== 'http:') {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL harus menggunakan https:// (atau http:// untuk Supabase lokal).',
    );
  }

  return { url, key };
}
