export type ClinicSource = "google" | "csv";

export type ClinicLocation = {
  lat: number;
  lng: number;
};

export type VeterinaryClinic = {
  id: string;
  name: string | null;
  isOperational: boolean;
  isOpenNow: boolean | null;
  isOpen24_7: boolean | null;
  rating: number | null;
  userRatingsTotal: number | null;
  phone: string | null;
  address: string | null;
  website: string | null;
  googleMapsUrl: string | null;
  location: ClinicLocation | null;
  distanceMeters: number | null;
  icon: {
    url: string | null;
    backgroundColor: string | null;
    maskBaseUri: string | null;
  };
  services: string[];
  isEmergency: boolean;
  types: string[];
  sources: ClinicSource[];
};

export type NearbyClinicSearchParams = {
  latitude: number;
  longitude: number;
  distanceKm: 5 | 10 | 25 | 50;
  openNow?: boolean;
  open24_7?: boolean;
  emergency?: boolean;
  services: string[];
  sort: "nearest" | "rating";
  page: number;
  pageSize: number;
  language: string;
};

export type ClinicRepositorySearchParams = {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  language: string;
};
