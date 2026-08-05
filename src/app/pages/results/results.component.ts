import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { NatiUiButtonDirective, NatiUiHeadingDirective } from 'ui-components';
import { PlaceCardComponent } from '../../components/place-card/place-card.component';
import { PlaceDetailsModalComponent } from '../../components/place-details-modal/place-details-modal.component';
import { PlacesService } from '../../services/places.service';
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

  private readonly queryParams = toSignal(this.route.queryParamMap, { requireSync: true });

  protected readonly place = computed(() => this.queryParams().get('place') ?? '');
  protected readonly from = computed(() => this.queryParams().get('from'));
  protected readonly to = computed(() => this.queryParams().get('to'));
  protected readonly guests = computed(() => {
    const raw = this.queryParams().get('guests');
    return raw ? Number(raw) : null;
  });

  protected readonly results = computed(() => this.placesService.search(this.place(), this.guests()));

  protected readonly selectedPlace = signal<VacationPlace | null>(null);

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
