import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NatiUiMenuComponent } from 'ui-components';
import {
  LucideLock,
  LucideLogIn,
  LucideLogOut,
  LucideMenu,
  LucideMoon,
  LucideSettings,
  LucideSun,
  LucideUserPlus,
  LucideX,
} from '@lucide/angular';
import { AuthService } from '../../services/auth.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    NatiUiMenuComponent,
    LucideMenu,
    LucideX,
    LucideSun,
    LucideMoon,
    LucideLogIn,
    LucideUserPlus,
    LucideSettings,
    LucideLock,
    LucideLogOut,
  ],
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.scss',
})
export class NavMenuComponent {
  protected readonly authService = inject(AuthService);
  protected readonly themeService = inject(ThemeService);
  private readonly router = inject(Router);

  private readonly menu = viewChild.required(NatiUiMenuComponent);

  protected readonly open = signal(false);

  protected readonly initials = computed(() => {
    const user = this.authService.currentUser();
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  });

  protected toggleMenu(): void {
    this.open.update((v) => !v);
    if (this.open()) {
      this.menu().open();
    } else {
      this.menu().close();
    }
  }

  protected closeMenu(): void {
    this.open.set(false);
    this.menu().close();
  }

  protected onMenuClosed(): void {
    this.open.set(false);
  }

  protected logout(): void {
    this.closeMenu();
    this.authService.logout();
    this.router.navigateByUrl('/');
  }
}
