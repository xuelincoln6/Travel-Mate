export type TripRequest = {
  nationality: string;
  destination: string;
  departureDate: string;
  returnDate: string;
};

export type VisaInfo = {
  destination: string;
  requirement: string;
  visaFreeDays?: number;
  passportValidity: string;
  returnTicket: string;
  insurance: string;
  officialUrl?: string;
  eVisaUrl?: string;
};

export type TripPhoto = {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  credit: string;
};

export type ItineraryDay = {
  day: number;
  date: string;
  title: string;
  morning: string;
  afternoon: string;
  evening: string;
  restaurant: string;
  transport: string;
  photo?: TripPhoto;
};

export type WeatherDay = {
  date: string;
  condition: string;
  highC: number;
  lowC: number;
};

export type BudgetEstimate = {
  flights: number;
  hotel: number;
  food: number;
  transport: number;
  activities: number;
  total: number;
  currency: string;
};

export type ChecklistItem = {
  id: string;
  label: string;
  required: boolean;
};

export type ReservationLink = {
  id: string;
  label: string;
  description: string;
  url: string;
};

export type TripPlan = {
  request: TripRequest;
  visa: VisaInfo;
  itinerary: ItineraryDay[];
  weather: WeatherDay[];
  budget: BudgetEstimate;
  checklist: ChecklistItem[];
  reservationLinks: ReservationLink[];
};

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};
