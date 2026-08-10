import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NatiUiButtonDirective, NatiUiErrorMessageComponent, NatiUiInputDirective } from 'ui-components';
import { AuthCardComponent } from '../../../components/auth-card/auth-card.component';
import { PasswordRequirementsComponent } from '../../../components/password-requirements/password-requirements.component';
import { AuthError, AuthService } from '../../../services/auth.service';
import { passwordsMatchValidator } from '../../../validators/auth-validators';
import { passwordComplexityValidator } from '../../../validators/password-rules';

@Component({
  selector: 'app-signup',
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
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, passwordComplexityValidator],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, passwordsMatchValidator('password')],
    }),
  });

  protected readonly submitting = signal(false);
  protected readonly formError = signal<string | null>(null);
  protected readonly passwordValue = signal('');
  protected readonly passwordDirty = signal(false);

  constructor() {
    this.form.controls.password.valueChanges.pipe(takeUntilDestroyed()).subscribe((value) => {
      this.passwordValue.set(value);
      this.passwordDirty.set(true);
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

    const value = this.form.getRawValue();
    this.submitting.set(true);
    try {
      await this.authService.signup({
        firstName: value.firstName,
        lastName: value.lastName,
        email: value.email,
        password: value.password,
        pictureUrl: null,
      });
      this.router.navigateByUrl('/');
    } catch (error) {
      if (error instanceof AuthError) {
        this.formError.set(error.message);
        this.form.controls.email.setErrors({ taken: true });
        this.form.controls.email.markAsTouched();
      } else {
        this.formError.set('Something went wrong. Please try again.');
      }
    } finally {
      this.submitting.set(false);
    }
  }
}
