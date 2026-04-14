import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SupabaseService {
  private readonly enabled =
    Boolean(environment.supabaseUrl) &&
    Boolean(environment.supabaseAnonKey) &&
    environment.supabaseUrl !== 'https://YOUR_PROJECT.supabase.co' &&
    environment.supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY';

  readonly client: SupabaseClient | null = this.enabled
    ? createClient(environment.supabaseUrl, environment.supabaseAnonKey)
    : null;

  isConfigured(): boolean {
    return this.enabled;
  }
}
