import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { VacationPlace } from '../../models/place.model';

@Component({
  selector: 'app-place-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './place-card.component.html',
  styleUrl: './place-card.component.scss',
})
export class PlaceCardComponent {
  place = input.required<VacationPlace>();
  selected = output<VacationPlace>();
}
