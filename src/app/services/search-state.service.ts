import { Injectable, signal } from '@angular/core';
import { Params } from '@angular/router';
import { NatiUiDateRange } from 'ui-components';
import { VacationPlace } from '../models/place.model';

function toIso(date: Date | null | undefined): string | null {
  if (!date) return null;
  const y = date.getFullYear();
  const m = `${date.getMonth() + 1}`.padStart(2, '0');
  const d = `${date.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function fromIso(value: string | null): Date | null {
  if (!value) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/**
 * Single source of truth for the vacation search criteria (place, dates,
 * guests). A root-provided singleton so the criteria survive navigation
 * between the home and results pages instead of resetting whenever a page
 * component is destroyed/recreated.
 */
@Injectable({ providedIn: 'root' })
export class SearchStateService {
  readonly placeQuery = signal('');
  readonly selectedPlace = signal<VacationPlace | null>(null);
  readonly dateRange = signal<NatiUiDateRange | null>(null);
  readonly guests = signal(2);

  setPlace(query: string, place: VacationPlace | null = null): void {
    this.placeQuery.set(query);
    this.selectedPlace.set(place);
  }

  /** Builds router query params reflecting the current criteria. */
  toQueryParams(): Params {
    const range = this.dateRange();
    return {
      place: this.selectedPlace()?.name ?? this.placeQuery() ?? null,
      from: toIso(range?.start),
      to: toIso(range?.end),
      guests: this.guests(),
    };
  }

  /** Syncs the criteria from a route's query param map (e.g. on direct link/refresh). */
  applyQueryParams(params: { get(name: string): string | null }): void {
    this.placeQuery.set(params.get('place') ?? '');

    const from = fromIso(params.get('from'));
    const to = fromIso(params.get('to'));
    if (from || to) this.dateRange.set({ start: from, end: to });

    const guestsRaw = params.get('guests');
    if (guestsRaw) this.guests.set(Number(guestsRaw));
  }
}
