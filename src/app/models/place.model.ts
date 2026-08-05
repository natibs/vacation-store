export interface VacationPlace {
  id: string;
  name: string;
  canton: string;
  region: string;
  formattedAddress: string;
  lat: number;
  lng: number;
  description: string;
  longDescription: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
  maxGuests: number;
  amenities: string[];
  tags: string[];
  images: string[];
}
