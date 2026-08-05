import { ChangeDetectionStrategy, Component, effect, inject, input, output, viewChild } from '@angular/core';
import { NatiUiButtonDirective, NatiUiModalComponent, NatiUiToastService } from 'ui-components';
import { VacationPlace } from '../../models/place.model';

@Component({
  selector: 'app-place-details-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NatiUiModalComponent, NatiUiButtonDirective],
  templateUrl: './place-details-modal.component.html',
  styleUrl: './place-details-modal.component.scss',
})
export class PlaceDetailsModalComponent {
  private readonly toastService = inject(NatiUiToastService);
  private readonly modalRef = viewChild.required(NatiUiModalComponent);

  place = input<VacationPlace | null>(null);
  closed = output<void>();

  constructor() {
    effect(() => {
      const place = this.place();
      const modal = this.modalRef();
      if (place) {
        modal.open();
      } else {
        modal.close();
      }
    });
  }

  protected handleClosed(): void {
    this.closed.emit();
  }

  protected book(): void {
    const place = this.place();
    if (place) {
      this.toastService.success(`Booking request sent for ${place.name}.`);
    }
    this.modalRef().close();
  }
}
