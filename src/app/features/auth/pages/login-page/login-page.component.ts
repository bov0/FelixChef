import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LayoutShellComponent } from '../../../../shared/layout-shell/layout-shell.component';
import { AuthService } from '../../../../core/auth.service';
import { SupabaseService } from '../../../../core/supabase.service';
import { TEXTS } from '../../../../i18n/texts';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, LayoutShellComponent],
  templateUrl: './login-page.component.html'
})
export class LoginPageComponent {
  email = '';
  password = '';
  readonly error = signal('');
  readonly texts = TEXTS.auth;

  constructor(
    private readonly authService: AuthService,
    private readonly supabase: SupabaseService
  ) {}

  supabaseConfigured(): boolean {
    return this.supabase.isConfigured();
  }

  async submit(): Promise<void> {
    this.error.set('');
    const result = await this.authService.signIn(this.email, this.password);

    if (result.error) {
      this.error.set(result.error);
    }
  }
}
