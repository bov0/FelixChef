import { CommonModule } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { SupabaseService } from '../../core/supabase.service';
import { ThemeService } from '../../core/theme.service';
import { TEXTS } from '../../i18n/texts';

@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './layout-shell.component.html'
})
export class LayoutShellComponent {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly texts = TEXTS;

  private readonly auth = inject(AuthService);
  private readonly supabase = inject(SupabaseService);
  private readonly themeService = inject(ThemeService);

  readonly loggedIn = computed(() => this.auth.isLoggedIn());
  readonly themeLabel = computed(() =>
    this.themeService.theme() === 'dark' ? this.texts.header.themeLight : this.texts.header.themeDark
  );

  supabaseConfigured(): boolean {
    return this.supabase.isConfigured();
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {
    void this.auth.signOut();
  }
}
