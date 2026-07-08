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

type DestinationProfile = {
  key: string;
  matcher: string[];
  displayName: string;
  primaryCity: string;
  areas: string[];
  attractions: string[];
  foods: string[];
  transport: string[];
  arrivalTransfer: string;
  departureTransfer: string;
  dayThemes: string[];
  weather: Array<{ condition: string; highC: number; lowC: number }>;
  budget: {
    flights: number;
    hotelNight: number;
    foodDay: number;
    transportDay: number;
    activitiesDay: number;
    currency: string;
  };
  checklistExtras: string[];
  reservationLinks: Array<Omit<ReservationLink, "id">>;
  photos: TripPhoto[];
  visa: Partial<VisaInfo>;
};

const destinationProfiles: DestinationProfile[] = [
  {
    key: "japan",
    matcher: ["japan", "tokyo", "kyoto", "osaka"],
    displayName: "Japan",
    primaryCity: "Tokyo",
    areas: ["Shinjuku", "Asakusa", "Harajuku", "Shibuya", "Kyoto Gion", "Osaka Dotonbori"],
    attractions: [
      "Senso-ji Temple",
      "Meiji Shrine",
      "Shibuya Sky",
      "Fushimi Inari Taisha",
      "Arashiyama Bamboo Grove",
      "Osaka Castle"
    ],
    foods: ["ramen", "sushi", "okonomiyaki", "yakitori", "matcha desserts", "katsu curry"],
    transport: [
      "Tokyo Metro with a Suica or Pasmo IC card",
      "JR Yamanote Line",
      "Shinkansen between Tokyo, Kyoto, and Osaka",
      "local buses in Kyoto"
    ],
    arrivalTransfer: "Take the Narita Express, Haneda Monorail, or airport limousine bus into Tokyo.",
    departureTransfer: "Use airport rail with at least 3 hours of buffer for Narita or Haneda.",
    dayThemes: [
      "Tokyo arrival and neon neighbourhoods",
      "Old Tokyo temples and riverside streets",
      "Pop culture, fashion, and skyline views",
      "Kyoto shrine paths and tea houses",
      "Osaka food night"
    ],
    weather: [
      { condition: "Seasonal city weather", highC: 23, lowC: 15 },
      { condition: "Comfortable walking day", highC: 24, lowC: 16 },
      { condition: "Possible light rain", highC: 22, lowC: 14 }
    ],
    budget: { flights: 950, hotelNight: 180, foodDay: 75, transportDay: 28, activitiesDay: 55, currency: "AUD" },
    checklistExtras: ["IC transit card setup", "JR or regional rail pass check", "Cash for small ramen shops"],
    reservationLinks: [
      {
        label: "Japan Hotels",
        description: "Compare stays in Tokyo, Kyoto, Osaka, or near major train stations.",
        url: "https://www.booking.com/searchresults.html?ss=Japan"
      },
      {
        label: "JR Pass / Rail",
        description: "Check whether a national or regional rail pass fits your route.",
        url: "https://japanrailpass.net/en/"
      },
      {
        label: "Tokyo Airport Transfer",
        description: "Pre-book airport rail, bus, or private transfer options.",
        url: "https://www.klook.com/en-AU/search/result/?query=tokyo%20airport%20transfer"
      },
      {
        label: "Japan eSIM",
        description: "Set up data before arrival for maps, trains, and translation.",
        url: "https://www.airalo.com/japan-esim"
      },
      {
        label: "Japan Attractions",
        description: "Book teamLab, Shibuya Sky, Universal Studios Japan, or local tours.",
        url: "https://www.klook.com/en-AU/coureg/33-japan-things-to-do/"
      }
    ],
    photos: [
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
      }
    ],
    visa: {
      requirement: "Visa-free short stay for many passport holders. China Passport travelers should confirm the latest entry category before booking.",
      visaFreeDays: 90,
      passportValidity: "Valid for the duration of stay, with extra validity recommended.",
      officialUrl: "https://www.mofa.go.jp/j_info/visit/visa/index.html"
    }
  },
  {
    key: "france",
    matcher: ["france", "paris", "nice", "lyon"],
    displayName: "France",
    primaryCity: "Paris",
    areas: ["Le Marais", "Saint-Germain-des-Pres", "Montmartre", "Latin Quarter", "Versailles", "Seine riverbanks"],
    attractions: ["Louvre Museum", "Eiffel Tower", "Sainte-Chapelle", "Musee d'Orsay", "Palace of Versailles", "Sacre-Coeur"],
    foods: ["croissants", "steak frites", "crepes", "duck confit", "macarons", "French onion soup"],
    transport: ["Paris Metro", "RER train to Versailles", "TGV for city-to-city travel", "Batobus or Seine river walk"],
    arrivalTransfer: "Take the RER B, RoissyBus, or an official taxi from Charles de Gaulle into central Paris.",
    departureTransfer: "Use RER B or a fixed-fare official taxi to CDG or Orly with extra time for security.",
    dayThemes: [
      "Paris arrival and Seine orientation",
      "Royal museums and cafe streets",
      "Montmartre, markets, and classic Paris views",
      "Versailles or Left Bank culture",
      "Boutiques, patisseries, and final river walk"
    ],
    weather: [
      { condition: "Mild Paris walking weather", highC: 20, lowC: 12 },
      { condition: "Clouds with sunny breaks", highC: 21, lowC: 13 },
      { condition: "Chance of showers", highC: 18, lowC: 11 }
    ],
    budget: { flights: 1450, hotelNight: 260, foodDay: 105, transportDay: 24, activitiesDay: 85, currency: "AUD" },
    checklistExtras: ["Schengen visa documents if required", "Comfortable walking shoes", "Restaurant reservations for popular bistros"],
    reservationLinks: [
      {
        label: "Paris Hotels",
        description: "Compare stays in Le Marais, Saint-Germain, Opera, or near the Metro.",
        url: "https://www.booking.com/searchresults.html?ss=Paris%2C%20France"
      },
      {
        label: "Eiffel Tower Tickets",
        description: "Reserve timed entry for the Eiffel Tower or nearby Seine cruises.",
        url: "https://www.toureiffel.paris/en/rates-opening-times"
      },
      {
        label: "France Rail",
        description: "Book TGV and intercity train routes across France.",
        url: "https://www.sncf-connect.com/en-en/"
      },
      {
        label: "Paris Airport Transfer",
        description: "Compare CDG and Orly transfer options.",
        url: "https://www.klook.com/en-AU/search/result/?query=paris%20airport%20transfer"
      },
      {
        label: "Paris Attractions",
        description: "Book Louvre, Versailles, river cruises, and guided walking tours.",
        url: "https://www.getyourguide.com/paris-l16/"
      }
    ],
    photos: [
      {
        id: "paris-seine",
        title: "Seine river and Eiffel Tower",
        location: "Paris",
        imageUrl:
          "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "louvre-paris",
        title: "Louvre courtyard",
        location: "Paris",
        imageUrl:
          "https://images.unsplash.com/photo-1566139887685-6e11522ec62d?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "montmartre",
        title: "Montmartre streets",
        location: "Paris",
        imageUrl:
          "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      }
    ],
    visa: {
      requirement: "France is in the Schengen Area. Visa rules depend on passport; China Passport travelers generally need a short-stay Schengen visa unless exempt.",
      visaFreeDays: 90,
      passportValidity: "Passport should usually be valid at least 3 months after planned Schengen departure.",
      officialUrl: "https://france-visas.gouv.fr/"
    }
  },
  {
    key: "thailand",
    matcher: ["thailand", "bangkok", "phuket", "chiang mai"],
    displayName: "Thailand",
    primaryCity: "Bangkok",
    areas: ["Rattanakosin", "Sukhumvit", "Ari", "Chatuchak", "Chiang Mai Old City", "Phuket Old Town"],
    attractions: ["Grand Palace", "Wat Pho", "Jim Thompson House", "Chatuchak Weekend Market", "Doi Suthep", "Phi Phi Islands"],
    foods: ["pad thai", "boat noodles", "som tam", "mango sticky rice", "green curry", "Thai iced tea"],
    transport: ["BTS Skytrain", "MRT", "Grab ride-hailing", "Chao Phraya river boat", "domestic flights for islands"],
    arrivalTransfer: "Use the Airport Rail Link from Suvarnabhumi or a metered taxi from the official queue.",
    departureTransfer: "Allow extra Bangkok traffic buffer and use Airport Rail Link where practical.",
    dayThemes: [
      "Bangkok arrival and river temples",
      "Street food, canals, and creative districts",
      "Markets and massage recovery day",
      "Chiang Mai temples or island beach day",
      "Thai cooking, viewpoints, and night markets"
    ],
    weather: [
      { condition: "Hot and humid", highC: 33, lowC: 25 },
      { condition: "Tropical sun with possible storm", highC: 32, lowC: 25 },
      { condition: "Warm evening breeze", highC: 31, lowC: 24 }
    ],
    budget: { flights: 850, hotelNight: 120, foodDay: 45, transportDay: 18, activitiesDay: 50, currency: "AUD" },
    checklistExtras: ["Temple-appropriate clothing", "Mosquito repellent", "Small cash for markets and street food"],
    reservationLinks: [
      {
        label: "Thailand Hotels",
        description: "Compare Bangkok, Chiang Mai, Phuket, or island stays.",
        url: "https://www.booking.com/searchresults.html?ss=Thailand"
      },
      {
        label: "Bangkok Airport Transfer",
        description: "Book a transfer from Suvarnabhumi or Don Mueang.",
        url: "https://www.klook.com/en-AU/search/result/?query=bangkok%20airport%20transfer"
      },
      {
        label: "Thailand eSIM",
        description: "Set up data for Grab, translation, and maps.",
        url: "https://www.airalo.com/thailand-esim"
      },
      {
        label: "Thai Experiences",
        description: "Book cooking classes, island tours, temples, and food walks.",
        url: "https://www.klook.com/en-AU/coureg/4-thailand-things-to-do/"
      },
      {
        label: "Domestic Flights",
        description: "Compare island and northern Thailand flight connections.",
        url: "https://www.trip.com/flights/"
      }
    ],
    photos: [
      {
        id: "bangkok-temple",
        title: "Bangkok temple details",
        location: "Bangkok",
        imageUrl:
          "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "thai-market",
        title: "Thai market flavours",
        location: "Bangkok",
        imageUrl:
          "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "thai-island",
        title: "Island water",
        location: "Southern Thailand",
        imageUrl:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      }
    ],
    visa: {
      requirement: "Thailand entry rules depend on passport and stay length. Many travelers can enter visa-free for tourism; confirm before travel.",
      visaFreeDays: 30,
      passportValidity: "At least 6 months validity is commonly expected.",
      officialUrl: "https://www.thaievisa.go.th/",
      eVisaUrl: "https://www.thaievisa.go.th/"
    }
  },
  {
    key: "maldives",
    matcher: ["maldives", "male", "maafushi"],
    displayName: "Maldives",
    primaryCity: "Male",
    areas: ["Male", "Hulhumale", "Maafushi", "South Male Atoll", "Ari Atoll", "resort island lagoon"],
    attractions: ["Male Fish Market", "Hukuru Miskiy", "Maafushi sandbank", "house reef snorkelling", "dolphin cruise", "sunset beach"],
    foods: ["mas huni", "garudhiya", "reef fish curry", "hedhikaa snacks", "coconut desserts", "fresh tuna"],
    transport: ["speedboat transfer", "public ferry where available", "seaplane for resort islands", "walking on local islands"],
    arrivalTransfer: "Meet your hotel or resort speedboat, ferry, or seaplane desk at Velana International Airport.",
    departureTransfer: "Confirm boat or seaplane timing with your property the day before departure.",
    dayThemes: [
      "Lagoon arrival and island check-in",
      "House reef snorkelling and beach time",
      "Sandbank picnic and dolphin cruise",
      "Spa, kayaking, and sunset dinner",
      "Slow beach morning before transfer"
    ],
    weather: [
      { condition: "Warm tropical beach day", highC: 30, lowC: 27 },
      { condition: "Humid with sea breeze", highC: 31, lowC: 27 },
      { condition: "Possible passing shower", highC: 30, lowC: 26 }
    ],
    budget: { flights: 1250, hotelNight: 420, foodDay: 95, transportDay: 90, activitiesDay: 120, currency: "AUD" },
    checklistExtras: ["Reef-safe sunscreen", "Swimwear and cover-up", "Resort transfer confirmation", "Dry bag"],
    reservationLinks: [
      {
        label: "Maldives Resorts",
        description: "Compare resort islands, guesthouses, and transfer requirements.",
        url: "https://www.booking.com/searchresults.html?ss=Maldives"
      },
      {
        label: "Airport Speedboat Transfer",
        description: "Pre-confirm boat or seaplane transfers with your island stay.",
        url: "https://www.klook.com/en-AU/search/result/?query=maldives%20airport%20transfer"
      },
      {
        label: "Maldives Activities",
        description: "Book snorkelling, dolphin cruises, sandbanks, and water sports.",
        url: "https://www.getyourguide.com/maldives-l169012/"
      },
      {
        label: "Travel Insurance",
        description: "Choose coverage that includes water activities and medical evacuation.",
        url: "https://example.com/travel-insurance-maldives"
      },
      {
        label: "Maldives eSIM",
        description: "Arrange data for resort transfers and messaging.",
        url: "https://www.airalo.com/maldives-esim"
      }
    ],
    photos: [
      {
        id: "maldives-lagoon",
        title: "Turquoise lagoon",
        location: "Maldives",
        imageUrl:
          "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "maldives-villa",
        title: "Overwater villa",
        location: "Maldives",
        imageUrl:
          "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "maldives-beach",
        title: "White sand beach",
        location: "Maldives",
        imageUrl:
          "https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      }
    ],
    visa: {
      requirement: "Tourist visa on arrival is commonly available for eligible travelers with confirmed accommodation and onward travel.",
      visaFreeDays: 30,
      passportValidity: "Passport validity and hotel confirmation may be checked on arrival.",
      officialUrl: "https://immigration.gov.mv/tourist-visa/"
    }
  },
  {
    key: "australia",
    matcher: ["australia", "sydney", "melbourne", "brisbane", "gold coast"],
    displayName: "Australia",
    primaryCity: "Sydney",
    areas: ["Circular Quay", "The Rocks", "Bondi", "Surry Hills", "Manly", "Blue Mountains"],
    attractions: ["Sydney Opera House", "Harbour Bridge", "Bondi to Coogee Walk", "Royal Botanic Garden", "Taronga Zoo", "Blue Mountains"],
    foods: ["flat whites", "brunch plates", "seafood", "meat pies", "gelato", "modern Australian dining"],
    transport: ["Opal card trains and ferries", "Sydney Metro", "light rail", "domestic flights for interstate hops"],
    arrivalTransfer: "Take the Airport Link train or official rideshare from Sydney Airport.",
    departureTransfer: "Use Airport Link or rideshare with extra time for domestic or international terminals.",
    dayThemes: [
      "Sydney harbour arrival",
      "Beaches, coastal walks, and brunch",
      "Ferries, wildlife, and neighbourhood dining",
      "Blue Mountains day trip",
      "Markets and final harbour views"
    ],
    weather: [
      { condition: "Bright coastal weather", highC: 25, lowC: 17 },
      { condition: "Breezy harbour day", highC: 24, lowC: 16 },
      { condition: "Possible coastal shower", highC: 22, lowC: 15 }
    ],
    budget: { flights: 650, hotelNight: 230, foodDay: 95, transportDay: 26, activitiesDay: 80, currency: "AUD" },
    checklistExtras: ["ETA or visa grant notice", "Sunscreen", "Reusable water bottle", "Swimwear for beach days"],
    reservationLinks: [
      {
        label: "Sydney Hotels",
        description: "Compare stays near Circular Quay, Darling Harbour, Surry Hills, or Bondi.",
        url: "https://www.booking.com/searchresults.html?ss=Sydney%2C%20Australia"
      },
      {
        label: "Opal Transport",
        description: "Review train, ferry, metro, bus, and light rail options.",
        url: "https://transportnsw.info/tickets-opal/opal"
      },
      {
        label: "Sydney Airport Transfer",
        description: "Book airport train, shuttle, or private transfer options.",
        url: "https://www.klook.com/en-AU/search/result/?query=sydney%20airport%20transfer"
      },
      {
        label: "Sydney Attractions",
        description: "Book harbour cruises, Taronga Zoo, BridgeClimb, or Blue Mountains tours.",
        url: "https://www.getyourguide.com/sydney-l200/"
      },
      {
        label: "Australia eSIM",
        description: "Set up local data before landing.",
        url: "https://www.airalo.com/australia-esim"
      }
    ],
    photos: [
      {
        id: "sydney-opera-house",
        title: "Sydney Harbour",
        location: "Sydney",
        imageUrl:
          "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "bondi-beach",
        title: "Bondi coastal walk",
        location: "Sydney",
        imageUrl:
          "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "blue-mountains",
        title: "Blue Mountains day trip",
        location: "New South Wales",
        imageUrl:
          "https://images.unsplash.com/photo-1529108190281-9a4f620bc2d8?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      }
    ],
    visa: {
      requirement: "Most visitors need an ETA, eVisitor, or visitor visa before arrival.",
      passportValidity: "Valid passport required for the full stay.",
      officialUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder",
      eVisaUrl: "https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-finder"
    }
  },
  {
    key: "singapore",
    matcher: ["singapore"],
    displayName: "Singapore",
    primaryCity: "Singapore",
    areas: ["Marina Bay", "Chinatown", "Kampong Glam", "Little India", "Tiong Bahru", "Sentosa"],
    attractions: ["Gardens by the Bay", "Marina Bay Sands SkyPark", "Haw Par Villa", "National Gallery Singapore", "Sentosa", "Jewel Changi"],
    foods: ["Hainanese chicken rice", "laksa", "chilli crab", "satay", "kaya toast", "char kway teow"],
    transport: ["MRT with contactless card", "Grab", "public buses", "Sentosa Express"],
    arrivalTransfer: "Take the MRT, airport shuttle, or Grab from Changi Airport.",
    departureTransfer: "Leave time for Jewel Changi before your flight if your terminal timing allows.",
    dayThemes: [
      "Marina Bay arrival and skyline lights",
      "Hawker centres and heritage districts",
      "Gardens, galleries, and riverfront dining",
      "Sentosa or neighbourhood cafe day",
      "Jewel Changi and last hawker meal"
    ],
    weather: [
      { condition: "Hot and humid with possible shower", highC: 31, lowC: 26 },
      { condition: "Tropical cloud and sun", highC: 32, lowC: 26 },
      { condition: "Warm evening humidity", highC: 30, lowC: 25 }
    ],
    budget: { flights: 780, hotelNight: 240, foodDay: 65, transportDay: 16, activitiesDay: 70, currency: "AUD" },
    checklistExtras: ["SG Arrival Card", "Light breathable clothing", "Contactless card for MRT", "Umbrella for tropical showers"],
    reservationLinks: [
      {
        label: "Singapore Hotels",
        description: "Compare Marina Bay, Orchard, Chinatown, Bugis, and Sentosa stays.",
        url: "https://www.booking.com/searchresults.html?ss=Singapore"
      },
      {
        label: "Singapore Airport Transfer",
        description: "Book Changi airport shuttle, private transfer, or arrival support.",
        url: "https://www.klook.com/en-AU/search/result/?query=singapore%20airport%20transfer"
      },
      {
        label: "Singapore Attractions",
        description: "Book Gardens by the Bay, Universal Studios, Sentosa, and city passes.",
        url: "https://www.klook.com/en-AU/city/6-singapore-things-to-do/"
      },
      {
        label: "Singapore eSIM",
        description: "Get data for MRT routes, Grab, and hawker centre searches.",
        url: "https://www.airalo.com/singapore-esim"
      },
      {
        label: "SG Arrival Card",
        description: "Submit the official arrival declaration before travel.",
        url: "https://eservices.ica.gov.sg/sgarrivalcard/"
      }
    ],
    photos: [
      {
        id: "marina-bay",
        title: "Marina Bay skyline",
        location: "Singapore",
        imageUrl:
          "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "gardens-by-bay",
        title: "Gardens by the Bay",
        location: "Singapore",
        imageUrl:
          "https://images.unsplash.com/photo-1496939376851-89342e90adcd?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      },
      {
        id: "singapore-hawker",
        title: "Hawker centre meal",
        location: "Singapore",
        imageUrl:
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=1200&q=80",
        credit: "Unsplash"
      }
    ],
    visa: {
      requirement: "Singapore visa requirements depend on passport. Some nationalities need a visa before arrival and all visitors should complete arrival requirements.",
      passportValidity: "At least 6 months passport validity is commonly required.",
      officialUrl: "https://www.ica.gov.sg/enter-transit-depart/entering-singapore/visa_requirements"
    }
  }
];

const fallbackProfile: DestinationProfile = {
  key: "custom",
  matcher: [],
  displayName: "your destination",
  primaryCity: "the main arrival city",
  areas: ["the central district", "the old town", "the waterfront", "a local food neighbourhood", "a scenic day-trip area"],
  attractions: ["the main historic landmark", "a signature cultural site", "a local design district", "a scenic viewpoint", "a regional day trip"],
  foods: ["a signature local dish", "a popular breakfast", "a street-food favourite", "a regional dessert", "a casual dinner spot"],
  transport: ["airport train or official taxi", "local metro or bus", "walkable neighbourhood routes", "licensed ride-hailing"],
  arrivalTransfer: "Use the official airport train, shuttle, or licensed taxi into the main arrival area.",
  departureTransfer: "Pre-check transfer times and leave a generous airport buffer.",
  dayThemes: [
    "Arrival and neighbourhood orientation",
    "Historic centre and local food",
    "Signature sights and cultural districts",
    "Nature or regional day trip",
    "Final shopping and departure"
  ],
  weather: [
    { condition: "Seasonal local weather", highC: 24, lowC: 16 },
    { condition: "Comfortable walking day", highC: 25, lowC: 17 },
    { condition: "Possible light rain", highC: 23, lowC: 15 }
  ],
  budget: { flights: 1000, hotelNight: 190, foodDay: 75, transportDay: 30, activitiesDay: 60, currency: "AUD" },
  checklistExtras: ["Destination entry rule check", "Offline maps", "Local transport app"],
  reservationLinks: [],
  photos: [
    {
      id: "city-arrival",
      title: "City arrival",
      location: "Main city",
      imageUrl:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80",
      credit: "Unsplash"
    },
    {
      id: "local-streets",
      title: "Neighbourhood exploring",
      location: "Local streets",
      imageUrl:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
      credit: "Unsplash"
    },
    {
      id: "food-moment",
      title: "Local food stop",
      location: "Food district",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
      credit: "Unsplash"
    }
  ],
  visa: {
    requirement: "Visa rules depend on passport and trip purpose. Verify with the official authority before booking.",
    passportValidity: "At least 6 months validity after arrival is recommended."
  }
};

function getDestinationProfile(destination: string): DestinationProfile {
  const normalized = destination.toLowerCase();
  return (
    destinationProfiles.find((profile) =>
      profile.matcher.some((term) => normalized.includes(term))
    ) ?? {
      ...fallbackProfile,
      displayName: destination,
      primaryCity: destination,
      photos: fallbackProfile.photos.map((photo) => ({
        ...photo,
        title: `${destination} ${photo.title.toLowerCase()}`,
        location: destination
      }))
    }
  );
}

function pick<T>(items: T[], index: number): T {
  return items[index % items.length];
}

function nationalityNote(nationality: string): string {
  return nationality.trim() ? `For ${nationality.trim()} travelers, ` : "";
}

export function getVisaInfo(request: TripRequest): VisaInfo {
  const profile = getDestinationProfile(request.destination);
  const prefix = nationalityNote(request.nationality);

  return {
    destination: request.destination,
    requirement: `${prefix}${profile.visa.requirement ?? fallbackProfile.visa.requirement}`,
    visaFreeDays: profile.visa.visaFreeDays,
    passportValidity: profile.visa.passportValidity ?? fallbackProfile.visa.passportValidity!,
    returnTicket: `Recommended for ${request.destination} and may be requested by airline or border control.`,
    insurance: `Strongly recommended for ${request.destination}, especially for medical care, delays, and cancellations.`,
    officialUrl: profile.visa.officialUrl,
    eVisaUrl: profile.visa.eVisaUrl
  };
}

export function buildMockItinerary(request: TripRequest): ItineraryDay[] {
  const profile = getDestinationProfile(request.destination);
  const dates = getTripDates(request.departureDate, request.returnDate);
  const nights = calculateNights(request.departureDate, request.returnDate);
  const photos = buildTripPhotos(request);

  return dates.map((date, index) => {
    const area = pick(profile.areas, index);
    const attraction = pick(profile.attractions, index);
    const secondaryAttraction = pick(profile.attractions, index + 2);
    const food = pick(profile.foods, index);
    const dinner = pick(profile.foods, index + 2);
    const transport = pick(profile.transport, index);
    const isArrival = index === 0;
    const isDeparture = index === dates.length - 1;

    return {
      day: index + 1,
      date,
      title: `${pick(profile.dayThemes, index)} (${nights + 1}-day ${request.destination} plan)`,
      morning: isArrival
        ? `Arrive in ${profile.primaryCity} for your ${request.destination} trip. ${profile.arrivalTransfer}`
        : `Start in ${area} with ${food} nearby, then visit ${attraction}.`,
      afternoon: isDeparture
        ? `Keep the afternoon light in ${area}, collect luggage, and confirm your departure transfer.`
        : `Explore ${secondaryAttraction} and leave time for ${area} streets, shops, or local cafes.`,
      evening: isDeparture
        ? `${profile.departureTransfer} If timing allows, have one last ${dinner} before departure.`
        : `Spend the evening around ${area}; look for sunset or night views that feel specific to ${request.destination}.`,
      restaurant: isDeparture
        ? `Choose a convenient ${request.destination} cafe or airport-area meal featuring ${dinner}.`
        : `Book or queue for ${food}; if full, pick a casual local spot serving ${dinner}.`,
      transport: isArrival || isDeparture ? profile.arrivalTransfer : `Use ${transport}; keep rides short between ${area} and ${attraction}.`,
      photo: photos[index % photos.length]
    };
  });
}

export function buildWeather(request: TripRequest): WeatherDay[] {
  const profile = getDestinationProfile(request.destination);

  return getTripDates(request.departureDate, request.returnDate).map((date, index) => {
    const weather = pick(profile.weather, index);

    return {
      date,
      condition: `${request.destination}: ${weather.condition}`,
      highC: weather.highC,
      lowC: weather.lowC
    };
  });
}

export function buildBudget(request: TripRequest): BudgetEstimate {
  const profile = getDestinationProfile(request.destination);
  const nights = calculateNights(request.departureDate, request.returnDate);
  const days = nights + 1;
  const hotel = nights * profile.budget.hotelNight;
  const food = days * profile.budget.foodDay;
  const transport = days * profile.budget.transportDay;
  const activities = days * profile.budget.activitiesDay;
  const flights = profile.budget.flights;

  return {
    flights,
    hotel,
    food,
    transport,
    activities,
    total: flights + hotel + food + transport + activities,
    currency: profile.budget.currency
  };
}

export function buildChecklist(request: TripRequest): ChecklistItem[] {
  const profile = getDestinationProfile(request.destination);
  const items = [
    "Passport",
    `${request.destination} visa or entry approval`,
    `Travel insurance for ${request.destination}`,
    `${request.destination} SIM/eSIM`,
    "Power adapter",
    "Cash",
    "Credit card",
    "Medications",
    `Return ticket for ${request.destination}`,
    `${request.destination} hotel confirmation`,
    ...profile.checklistExtras
  ];

  return items.map((label, index) => ({
    id: `${index}-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    label,
    required: index < 4
  }));
}

export function buildReservationLinks(request: TripRequest): ReservationLink[] {
  const profile = getDestinationProfile(request.destination);
  const destination = encodeURIComponent(request.destination);
  const profileLinks =
    profile.reservationLinks.length > 0
      ? profile.reservationLinks
      : [
          {
            label: `${request.destination} Hotels`,
            description: `Compare hotels and refundable stays in ${request.destination}.`,
            url: `https://www.booking.com/searchresults.html?ss=${destination}`
          },
          {
            label: `${request.destination} Airport Transfer`,
            description: `Book airport transfer options for ${request.destination}.`,
            url: `https://www.klook.com/en-AU/search/result/?query=${destination}%20airport%20transfer`
          },
          {
            label: `${request.destination} Attractions`,
            description: `Reserve popular tours and experiences in ${request.destination}.`,
            url: `https://www.getyourguide.com/s/?q=${destination}`
          },
          {
            label: `${request.destination} eSIM`,
            description: `Set up mobile data before arrival in ${request.destination}.`,
            url: `https://www.airalo.com/search/${destination}`
          },
          {
            label: "Travel Insurance",
            description: `Review coverage for ${request.destination}, medical care, delays, and cancellations.`,
            url: "https://example.com/travel-insurance"
          }
        ];

  return profileLinks.map((link, index) => ({
    id: `${index}-${link.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    ...link
  }));
}

export function buildTripPhotos(request: TripRequest): TripPhoto[] {
  return getDestinationProfile(request.destination).photos;
}
