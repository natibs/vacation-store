import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NatiUiToastComponent } from 'ui-components';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NatiUiToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly themeService = inject(ThemeService);
}
