import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'theme-mode';

export type ThemeMode = 'dark' | 'light';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>('dark');

  constructor() {
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode | null) ?? 'dark';
    this.apply(stored);
  }

  toggle() {
    const next = this.mode() === 'dark' ? 'light' : 'dark';
    this.apply(next);
  }

  private apply(mode: ThemeMode) {
    this.mode.set(mode);
    document.body.setAttribute('data-theme', mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }
}
