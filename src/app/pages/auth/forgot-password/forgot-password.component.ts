import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NatiUiButtonDirective, NatiUiErrorMessageComponent, NatiUiInputDirective } from 'ui-components';
import { AuthCardComponent } from '../../../components/auth-card/auth-card.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NatiUiInputDirective,
    NatiUiButtonDirective,
    NatiUiErrorMessageComponent,
    AuthCardComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent {
  private readonly authService = inject(AuthService);

  protected readonly form = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly resetToken = signal<string | null>(null);
  protected readonly submittedEmail = signal<string | null>(null);

  protected async submit(): Promise<void> {
    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.getRawValue().email;
    this.submitting.set(true);
    try {
      const token = await this.authService.requestPasswordReset(email);
      if (!token) {
        this.formError.set('No account found with that email address.');
        return;
      }
      this.resetToken.set(token);
      this.submittedEmail.set(email);
    } finally {
      this.submitting.set(false);
    }
  }
}
