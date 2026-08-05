import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NatiUiButtonDirective,
  NatiUiDatepickerComponent,
  NatiUiDateRange,
  NatiUiHeadingDirective,
  NatiUiTypewriterComponent,
} from 'ui-components';
import { GuestStepperComponent } from '../../components/guest-stepper/guest-stepper.component';
import { PlaceAutocompleteComponent } from '../../components/place-autocomplete/place-autocomplete.component';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';
import { SWISS_PLACES } from '../../data/swiss-places.data';
import { VacationPlace } from '../../models/place.model';

function toIso(date: Date | null): string | null {
  if (!date) return null;
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

@Component({
  selector: 'app-home',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    NatiUiButtonDirective,
    NatiUiHeadingDirective,
    NatiUiDatepickerComponent,
    NatiUiTypewriterComponent,
    GuestStepperComponent,
    PlaceAutocompleteComponent,
    PlaceCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  private readonly router = inject(Router);

  protected readonly featuredPlaces = SWISS_PLACES.slice(0, 8);
  protected readonly heroTaglines = [
    'Discover Switzerland.',
    'Explore the Alps.',
    'Find your next stay.',
  ];

  protected readonly placeQuery = signal('');
  protected readonly selectedPlace = signal<VacationPlace | null>(null);
  protected readonly dateRange = signal<NatiUiDateRange | null>(null);
  protected readonly guests = signal(2);

  protected onPlaceSelected(place: VacationPlace | null): void {
    this.selectedPlace.set(place);
  }

  protected search(): void {
    const place = this.selectedPlace()?.name ?? this.placeQuery();
    const range = this.dateRange();

    this.router.navigate(['/results'], {
      queryParams: {
        place: place || null,
        from: toIso(range?.start ?? null),
        to: toIso(range?.end ?? null),
        guests: this.guests(),
      },
    });
  }

  protected browsePlace(place: VacationPlace): void {
    this.router.navigate(['/results'], { queryParams: { place: place.name, guests: this.guests() } });
  }
}
