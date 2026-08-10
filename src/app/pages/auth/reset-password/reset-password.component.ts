import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  NatiUiButtonDirective,
  NatiUiErrorMessageComponent,
  NatiUiInputDirective,
  NatiUiToastService,
} from 'ui-components';
import { AuthCardComponent } from '../../../components/auth-card/auth-card.component';
import { PasswordRequirementsComponent } from '../../../components/password-requirements/password-requirements.component';
import { AuthError, AuthService } from '../../../services/auth.service';
import { passwordsMatchValidator } from '../../../validators/auth-validators';
import { passwordComplexityValidator } from '../../../validators/password-rules';

@Component({
  selector: 'app-reset-password',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NatiUiInputDirective,
    NatiUiButtonDirective,
    NatiUiErrorMessageComponent,
    AuthCardComponent,
    PasswordRequirementsComponent,
  ],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(NatiUiToastService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly token = this.route.snapshot.queryParamMap.get('token');

  protected readonly form = new FormGroup({
    newPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, passwordComplexityValidator],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, passwordsMatchValidator('newPassword')],
    }),
  });

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly newPasswordValue = signal('');
  protected readonly newPasswordDirty = signal(false);

  constructor() {
    this.form.controls.newPassword.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.newPasswordValue.set(value);
      this.newPasswordDirty.set(true);
      this.form.controls.confirmPassword.updateValueAndValidity({
        onlySelf: true,
        emitEvent: false,
      });
    });
  }

  protected async submit(): Promise<void> {
    if (!this.token) return;

    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    try {
      await this.authService.resetPassword(this.token, this.form.getRawValue().newPassword);
      this.toastService.success('Your password has been reset. Log in with your new password.');
      this.router.navigateByUrl('/login');
    } catch (error) {
      this.formError.set(
        error instanceof AuthError ? error.message : 'Something went wrong. Please try again.',
      );
    } finally {
      this.submitting.set(false);
    }
  }
}
