import { Injectable } from '@angular/core';
import { SWISS_PLACES } from '../data/swiss-places.data';
import { VacationPlace } from '../models/place.model';

function matchesPlace(place: VacationPlace, query: string): boolean {
  return place.name.toLowerCase().includes(query) || place.canton.toLowerCase().includes(query);
}

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private readonly places = SWISS_PLACES;

  suggest(query: string, limit = 8): VacationPlace[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.places.slice(0, limit);

    return this.places.filter((p) => matchesPlace(p, q)).slice(0, limit);
  }

  search(query: string, guests: number | null): VacationPlace[] {
    const q = query.trim().toLowerCase();
    return this.places.filter((p) => {
      const matchesQuery = !q || matchesPlace(p, q);
      const matchesGuests = !guests || p.maxGuests >= guests;
      return matchesQuery && matchesGuests;
    });
  }

  getById(id: string): VacationPlace | null {
    return this.places.find((p) => p.id === id) ?? null;
  }

  all(): VacationPlace[] {
    return this.places;
  }
}
