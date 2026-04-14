import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'felixchef-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly theme = signal<ThemeMode>('dark');

  constructor(@Inject(DOCUMENT) private readonly document: Document) {
    this.init();
  }

  toggleTheme(): void {
    this.setTheme(this.theme() === 'dark' ? 'light' : 'dark');
  }

  setTheme(theme: ThemeMode): void {
    this.theme.set(theme);
    this.document.documentElement.dataset['theme'] = theme;
    localStorage.setItem(STORAGE_KEY, theme);
  }

  private init(): void {
    const storedTheme = localStorage.getItem(STORAGE_KEY);
    const theme: ThemeMode = storedTheme === 'light' ? 'light' : 'dark';
    this.setTheme(theme);
  }
}
