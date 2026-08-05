import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  NatiUiButtonDirective,
  NatiUiDatepickerComponent,
  NatiUiHeadingDirective,
  NatiUiTypewriterComponent,
} from 'ui-components';
import { GuestStepperComponent } from '../../components/guest-stepper/guest-stepper.component';
import { PlaceAutocompleteComponent } from '../../components/place-autocomplete/place-autocomplete.component';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';
import { SWISS_PLACES } from '../../data/swiss-places.data';
import { SearchStateService } from '../../services/search-state.service';
import { VacationPlace } from '../../models/place.model';

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
  protected readonly searchState = inject(SearchStateService);

  protected readonly featuredPlaces = SWISS_PLACES.slice(0, 8);
  protected readonly heroTaglines = [
    'Discover Switzerland.',
    'Explore the Alps.',
    'Find your next stay.',
  ];

  protected onPlaceSelected(place: VacationPlace | null): void {
    this.searchState.selectedPlace.set(place);
  }

  protected search(): void {
    this.router.navigate(['/results'], { queryParams: this.searchState.toQueryParams() });
  }

  protected browsePlace(place: VacationPlace): void {
    this.searchState.setPlace(place.name, place);
    this.router.navigate(['/results'], { queryParams: this.searchState.toQueryParams() });
  }
}
