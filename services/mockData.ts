import { calculateNights, getTripDates } from "@/lib/date";
import type {
  BudgetEstimate,
  ChecklistItem,
  ItineraryDay,
  ReservationLink,
  TripPhoto,
  TripRequest,
  VisaInfo,
  WeatherDay
} from "@/types/trip";

const visaProfiles: Record<string, Partial<VisaInfo>> = {
  japan: {
    requirement: "Visa-free short stay for many passport holders. Confirm before booking.",
    visaFreeDays: 90,
    passportValidity: "Valid for the duration of stay, with extra validity recommended.",
    officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html"
  },
  australia: {
    requirement: "Most visitors need an ETA, eVisitor, or visitor visa before arrival.",
    passportValidity: "Valid passport required for the full stay.",
    officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
    eVisaUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder"
  },
  china: {
    requirement: "Visa requirements vary by passport, city, and transit route.",
    passportValidity: "At least 6 months validity is commonly required.",
    officialUrl: "https://www.visaforchina.cn/"
  }
};

export function getVisaInfo(request: TripRequest): VisaInfo {
  const key = request.destination.toLowerCase();
  const profile = Object.keys(visaProfiles).find((name) => key.includes(name));
  const base = profile ? visaProfiles[profile] : {};

  return {
    destination: request.destination,
    requirement: base.requirement ?? "Visa rules depend on passport and trip purpose. Verify with the official authority.",
    visaFreeDays: base.visaFreeDays,
    passportValidity: base.passportValidity ?? "At least 6 months validity after arrival is recommended.",
    returnTicket: "Recommended and may be requested by airline or border control.",
    insurance: "Strongly recommended for medical care, delays, and cancellations.",
    officialUrl: base.officialUrl,
    eVisaUrl: base.eVisaUrl
  };
}

export function buildMockItinerary(request: TripRequest): ItineraryDay[] {
  const dates = getTripDates(request.departureDate, request.returnDate);
  const themes = [
    "Arrival and first impressions",
    "Culture and neighbourhoods",
    "Food, markets, and local rhythm",
    "Nature, views, and a slower day",
    "Hidden gems and flexible exploring",
    "Signature sights and final shopping",
    "Departure day"
  ];

  return dates.map((date, index) => ({
    day: index + 1,
    date,
    title: themes[Math.min(index, themes.length - 1)],
    morning:
      index === 0
        ? `Arrive in ${request.destination}, clear immigration, and transfer to your hotel.`
        : `Start with a relaxed breakfast near your stay, then visit a major ${request.destination} landmark.`,
    afternoon:
      index === dates.length - 1
        ? "Pack, check out, and leave time for airport or station transfer."
        : "Explore a walkable district with a mix of shops, galleries, parks, or local streets.",
    evening:
      index === dates.length - 1
        ? "Depart with buffer time for security, customs, and transport delays."
        : "Choose a scenic area for sunset, then keep dinner close to your accommodation.",
    restaurant:
      index === dates.length - 1
        ? "Casual cafe or airport meal depending on your departure time."
        : `Try a well-rated local restaurant serving ${request.destination} regional favourites.`,
    transport:
      index === 0 || index === dates.length - 1
        ? "Use airport rail, official taxi, or pre-booked transfer."
        : "Use public transport for main routes and short taxi rides late at night."
  }));
}

export function buildWeather(request: TripRequest): WeatherDay[] {
  const conditions = ["Mild", "Partly cloudy", "Sunny intervals", "Light breeze"];

  return getTripDates(request.departureDate, request.returnDate).map((date, index) => ({
    date,
    condition: conditions[index % conditions.length],
    highC: 22 + (index % 5),
    lowC: 14 + (index % 4)
  }));
}

export function buildBudget(request: TripRequest): BudgetEstimate {
  const nights = calculateNights(request.departureDate, request.returnDate);
  const hotel = nights * 180;
  const food = (nights + 1) * 75;
  const transport = (nights + 1) * 28;
  const activities = (nights + 1) * 55;
  const flights = 950;

  return {
    flights,
    hotel,
    food,
    transport,
    activities,
    total: flights + hotel + food + transport + activities,
    currency: "AUD"
  };
}

export function buildChecklist(request: TripRequest): ChecklistItem[] {
  const destination = request.destination.toLowerCase();
  const items = [
    "Passport",
    "Visa or entry approval",
    "Travel insurance",
    "SIM/eSIM",
    "Power adapter",
    "Cash",
    "Credit card",
    "Medications",
    "Return ticket",
    "Hotel confirmation"
  ];

  if (destination.includes("japan")) {
    items.push("IC transit card setup", "JR or regional rail pass check");
  }

  if (destination.includes("australia")) {
    items.push("ETA or visa grant notice", "Sunscreen");
  }

  return items.map((label, index) => ({
    id: `${index}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label,
    required: index < 4
  }));
}

export function buildReservationLinks(request: TripRequest): ReservationLink[] {
  const destination = encodeURIComponent(request.destination);

  return [
    {
      id: "hotel",
      label: "Hotel",
      description: "Compare refundable stays near your preferred neighbourhood.",
      url: `https://www.booking.com/searchresults.html?ss=${destination}`
    },
    {
      id: "transfer",
      label: "Airport Transfer",
      description: "Book a private or shared arrival transfer.",
      url: "https://example.com/airport-transfer"
    },
    {
      id: "insurance",
      label: "Travel Insurance",
      description: "Review coverage for medical care, delays, and cancellations.",
      url: "https://example.com/travel-insurance"
    },
    {
      id: "esim",
      label: "eSIM",
      description: "Set up mobile data before arrival.",
      url: "https://example.com/esim"
    },
    {
      id: "attractions",
      label: "Attractions",
      description: "Reserve popular experiences and skip-the-line entries.",
      url: "https://example.com/attractions"
    }
  ];
}

export function buildTripPhotos(request: TripRequest): TripPhoto[] {
  const destination = request.destination.toLowerCase();

  if (destination.includes("japan")) {
    return [
      {
        id: "tokyo-evening",
        title: "Tokyo evening streets",
        location: "Tokyo",
        imageUrl:
          "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "kyoto-shrine",
        title: "Historic shrine walk",
        location: "Kyoto",
        imageUrl:
          "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "mount-fuji",
        title: "Mount Fuji views",
        location: "Fuji Five Lakes",
        imageUrl:
          "https://images.unsplash.com/photo-1570459027562-4a916cc6113f?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "japan-food",
        title: "Local food stops",
        location: "Across Japan",
        imageUrl:
          "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      }
    ];
  }

  return [
    {
      id: "city-arrival",
      title: `${request.destination} city arrival`,
      location: request.destination,
      imageUrl:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      credit: "Unsplash"
    },
    {
      id: "local-streets",
      title: "Neighbourhood exploring",
      location: request.destination,
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      credit: "Unsplash"
    },
    {
      id: "food-moment",
      title: "Food and market stops",
      location: request.destination,
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      credit: "Unsplash"
    },
    {
      id: "sunset-view",
      title: "Sunset viewpoint",
      location: request.destination,
      imageUrl:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80",
      credit: "Unsplash"
    }
  ];
}
