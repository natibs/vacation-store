import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  selector: 'app-guest-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './guest-stepper.component.html',
  styleUrl: './guest-stepper.component.scss',
})
export class GuestStepperComponent {
  label = input('Guests');
  min = input(1);
  max = input(16);
  value = model(2);

  protected increment(): void {
    this.value.update((v) => Math.min(this.max(), v + 1));
  }

  protected decrement(): void {
    this.value.update((v) => Math.max(this.min(), v - 1));
  }
}
