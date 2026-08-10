import { ChangeDetectionStrategy, Component, model, signal } from '@angular/core';
import { NatiUiButtonDirective } from 'ui-components';
import { readFileAsDataUrl } from '../../utils/read-file-as-data-url';

const MAX_PICTURE_BYTES = 2 * 1024 * 1024;

@Component({
  selector: 'app-profile-picture-input',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NatiUiButtonDirective],
  templateUrl: './profile-picture-input.component.html',
  styleUrl: './profile-picture-input.component.scss',
})
export class ProfilePictureInputComponent {
  value = model<string | null>(null);

  protected readonly error = signal<string | null>(null);

  protected async onSelected(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0] ?? null;
    this.error.set(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.error.set('Please choose an image file.');
      return;
    }
    if (file.size > MAX_PICTURE_BYTES) {
      this.error.set('Image must be smaller than 2 MB.');
      return;
    }

    this.value.set(await readFileAsDataUrl(file));
  }

  protected clear(input: HTMLInputElement): void {
    input.value = '';
    this.value.set(null);
    this.error.set(null);
  }
}
