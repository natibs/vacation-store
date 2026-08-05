import { Injectable } from '@angular/core';
import { SWISS_PLACES } from '../data/swiss-places.data';
import { VacationPlace } from '../models/place.model';

@Injectable({ providedIn: 'root' })
export class PlacesService {
  private readonly places = SWISS_PLACES;

  suggest(query: string, limit = 8): VacationPlace[] {
    const q = query.trim().toLowerCase();
    if (!q) return this.places.slice(0, limit);

    return this.places
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.canton.toLowerCase().includes(q) ||
          p.region.toLowerCase().includes(q),
      )
      .slice(0, limit);
  }

  search(query: string, guests: number | null): VacationPlace[] {
    const q = query.trim().toLowerCase();
    return this.places.filter((p) => {
      const matchesQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.canton.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q);
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
