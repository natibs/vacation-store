import { ChangeDetectionStrategy, Component, computed, inject, input, model, output, signal } from '@angular/core';
import { VacationPlace } from '../../models/place.model';
import { PlacesService } from '../../services/places.service';

let nextId = 0;

@Component({
  selector: 'app-place-autocomplete',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './place-autocomplete.component.html',
  styleUrl: './place-autocomplete.component.scss',
})
export class PlaceAutocompleteComponent {
  private readonly placesService = inject(PlacesService);

  readonly inputId = `place-autocomplete-${++nextId}`;

  label = input('Where to');
  placeholder = input('City, region or landmark in Switzerland');
  query = model('');

  placeSelected = output<VacationPlace | null>();

  protected readonly open = signal(false);
  protected readonly suggestions = computed(() => this.placesService.suggest(this.query()));

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);
    this.open.set(true);
    this.placeSelected.emit(null);
  }

  protected onFocus(): void {
    this.open.set(true);
  }

  protected onBlur(): void {
    setTimeout(() => this.open.set(false), 120);
  }

  protected select(place: VacationPlace): void {
    this.query.set(place.name);
    this.open.set(false);
    this.placeSelected.emit(place);
  }
}
