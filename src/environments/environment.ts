const envFromWindow = typeof window !== 'undefined' ? (window as any).env : undefined;

export const environment = {
  production: false,
  supabaseUrl: envFromWindow?.SUPABASE_URL || 'https://YOUR_PROJECT.supabase.co',
  supabaseAnonKey: envFromWindow?.SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'
};
