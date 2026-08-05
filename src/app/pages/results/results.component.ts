import { ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NatiUiButtonDirective, NatiUiHeadingDirective } from 'ui-components';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';
import { PlaceDetailsModalComponent } from '../../components/place-details-modal/place-details-modal.component';
import { PlacesService } from '../../services/places.service';
import { SearchStateService } from '../../services/search-state.service';
import { VacationPlace } from '../../models/place.model';

@Component({
  selector: 'app-results',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NatiUiHeadingDirective, NatiUiButtonDirective, PlaceCardComponent, PlaceDetailsModalComponent],
  templateUrl: './results.component.html',
  styleUrl: './results.component.scss',
})
export class ResultsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly placesService = inject(PlacesService);
  protected readonly searchState = inject(SearchStateService);

  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: true });

  protected readonly from = computed(() => this.queryParams().get('from'));
  protected readonly to = computed(() => this.queryParams().get('to'));

  protected readonly results = computed(() =>
    this.placesService.search(this.searchState.placeQuery(), this.searchState.guests() || null),
  );

  protected readonly selectedPlace = signal<VacationPlace | null>(null);

  constructor() {
    // The URL is the source of truth for a direct link/refresh — sync it into
    // the shared search state once per navigation, without re-tracking it.
    effect(() => {
      const params = this.queryParams();
      untracked(() => this.searchState.applyQueryParams(params));
    });
  }

  protected openDetails(place: VacationPlace): void {
    this.selectedPlace.set(place);
  }

  protected closeDetails(): void {
    this.selectedPlace.set(null);
  }

  protected backToHome(): void {
    this.router.navigate(['/']);
  }
}
