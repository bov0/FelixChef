import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { SupabaseService } from './supabase.service';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = inject(AuthService);
  const supabase = inject(SupabaseService);

  await auth.restoreSession();

  if (!supabase.isConfigured()) {
    return router.createUrlTree(['/login']);
  }

  return auth.isLoggedIn() ? true : router.createUrlTree(['/login']);
};
