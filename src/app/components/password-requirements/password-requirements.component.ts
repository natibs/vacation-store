import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LucideCheck, LucideX } from '@lucide/angular';
import { PASSWORD_RULES, PasswordRule } from '../../validators/password-rules';

@Component({
  selector: 'app-password-requirements',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LucideCheck, LucideX],
  templateUrl: './password-requirements.component.html',
  styleUrl: './password-requirements.component.scss',
})
export class PasswordRequirementsComponent {
  value = input('');

  protected readonly rules = PASSWORD_RULES;

  protected isValid(rule: PasswordRule): boolean {
    return rule.test(this.value());
  }
}
