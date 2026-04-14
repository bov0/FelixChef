import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly supabase = inject(SupabaseService);
  private readonly router = inject(Router);
  private readonly sessionSignal = signal<boolean>(false);

  readonly isLoggedIn = computed(() => this.sessionSignal());

  constructor() {
    void this.restoreSession();
  }

  async restoreSession(): Promise<void> {
    if (!this.supabase.client) {
      this.sessionSignal.set(false);
      return;
    }

    const { data } = await this.supabase.client.auth.getSession();
    this.sessionSignal.set(Boolean(data.session));

    this.supabase.client.auth.onAuthStateChange((_event, session) => {
      this.sessionSignal.set(Boolean(session));
    });
  }

  async signIn(email: string, password: string): Promise<{ error?: string }> {
    if (!this.supabase.client) {
      return { error: 'Configura Supabase antes de iniciar sesión.' };
    }

    const { error } = await this.supabase.client.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: error.message };
    }

    await this.router.navigateByUrl('/admin');
    return {};
  }

  async signOut(): Promise<void> {
    if (this.supabase.client) {
      await this.supabase.client.auth.signOut();
    }

    this.sessionSignal.set(false);
    await this.router.navigateByUrl('/');
  }
}
