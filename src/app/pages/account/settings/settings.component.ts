import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NatiUiButtonDirective, NatiUiInputDirective, NatiUiToastService } from 'ui-components';
import { AuthCardComponent } from '../../../components/auth-card/auth-card.component';
import { ProfilePictureInputComponent } from '../../../components/profile-picture-input/profile-picture-input.component';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    NatiUiInputDirective,
    NatiUiButtonDirective,
    AuthCardComponent,
    ProfilePictureInputComponent,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(NatiUiToastService);

  private readonly user = this.authService.currentUser();

  protected readonly email = this.user?.email ?? '';

  protected readonly form = new FormGroup({
    firstName: new FormControl(this.user?.firstName ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    lastName: new FormControl(this.user?.lastName ?? '', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  protected readonly pictureUrl = signal<string | null>(this.user?.pictureUrl ?? null);
  protected readonly submitting = signal(false);

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { firstName, lastName } = this.form.getRawValue();
    this.submitting.set(true);
    try {
      this.authService.updateProfile({ firstName, lastName, pictureUrl: this.pictureUrl() });
      this.toastService.success('Your profile has been updated.');
    } finally {
      this.submitting.set(false);
    }
  }
}
