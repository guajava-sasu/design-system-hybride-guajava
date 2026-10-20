import { DOCUMENT } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { navigation } from './app.routes';

type Theme = 'light' | 'dark';

const themeStorageKey = 'arcelor-mittal-showcase-theme';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
  host: {
    '(document:keydown.escape)': 'closeMenu()',
  },
})
export class App {
  private readonly document = inject(DOCUMENT);

  protected readonly navigation = navigation;
  protected readonly menuOpen = signal(false);
  protected readonly theme = signal<Theme>(this.readTheme());

  constructor() {
    this.applyTheme(this.theme());
    inject(Router)
      .events.pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.menuOpen.set(false));
  }

  protected toggleTheme(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    localStorage.setItem(themeStorageKey, next);
    this.theme.set(next);
    this.applyTheme(next);
  }

  protected toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.document.getElementById('contenu')?.focus();
  }

  private readTheme(): Theme {
    return localStorage.getItem(themeStorageKey) === 'dark' ? 'dark' : 'light';
  }

  private applyTheme(theme: Theme): void {
    const root = this.document.documentElement;
    root.dataset['theme'] = theme;
    root.style.colorScheme = theme;
  }
}
