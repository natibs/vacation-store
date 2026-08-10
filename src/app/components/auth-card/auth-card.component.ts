import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NatiUiHeadingDirective } from 'ui-components';

@Component({
  selector: 'app-auth-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NatiUiHeadingDirective],
  templateUrl: './auth-card.component.html',
  styleUrl: './auth-card.component.scss',
})
export class AuthCardComponent {
  title = input.required<string>();
  subtitle = input<string | null>(null);
}
