import { Injectable, effect, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'vacation-store-theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSig = signal<Theme>(this.resolveInitialTheme());
  readonly theme = this.themeSig.asReadonly();

  constructor() {
    effect(() => {
      const theme = this.themeSig();
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(STORAGE_KEY, theme);
    });
  }

  toggle(): void {
    this.themeSig.update((t) => (t === 'dark' ? 'light' : 'dark'));
  }

  private resolveInitialTheme(): Theme {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  }
}
