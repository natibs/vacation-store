import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
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
  selector: 'app-change-password',
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
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(NatiUiToastService);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({
    currentPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
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
    this.formError.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.form.getRawValue();
    this.submitting.set(true);
    try {
      await this.authService.changePassword(currentPassword, newPassword);
      this.toastService.success('Your password has been updated.');
      this.router.navigateByUrl('/');
    } catch (error) {
      if (error instanceof AuthError) {
        this.form.controls.currentPassword.setErrors({ incorrect: true });
        this.form.controls.currentPassword.markAsTouched();
        this.formError.set(error.message);
      } else {
        this.formError.set('Something went wrong. Please try again.');
      }
    } finally {
      this.submitting.set(false);
    }
  }
}
