import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LucideMoon, LucideSun, LucideSunrise, LucideSunset } from '@lucide/angular';
import { NatiUiToastComponent } from 'ui-components';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { AuthService } from './services/auth.service';
import { ThemeService } from './services/theme.service';
import { getGreeting } from './utils/greeting.util';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    NatiUiToastComponent,
    NavMenuComponent,
    LucideSunrise,
    LucideSun,
    LucideSunset,
    LucideMoon,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly themeService = inject(ThemeService);
  protected readonly authService = inject(AuthService);
  protected readonly greeting = getGreeting();

  protected readonly initials = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  });
}
