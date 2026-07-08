import OpenAI from "openai";
import {
  buildBudget,
  buildChecklist,
  buildMockItinerary,
  buildReservationLinks,
  buildTripPhotos,
  buildWeather,
  getVisaInfo
} from "@/services/mockData";
import type { ChatMessage, ItineraryDay, TripPlan, TripRequest } from "@/types/trip";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

type ItineraryResponse = {
  itinerary: ItineraryDay[];
};

function extractJson<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return null;
    }

    try {
      return JSON.parse(match[0]) as T;
    } catch {
      return null;
    }
  }
}

async function generateAiItinerary(request: TripRequest): Promise<ItineraryDay[] | null> {
  if (!openai) {
    return null;
  }

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You are a practical travel planner. Return strict JSON only. Keep suggestions concise, realistic, and safe."
      },
      {
        role: "user",
        content: `Create a day-by-day itinerary for this trip:
Passport/Nationality: ${request.nationality}
Destination: ${request.destination}
Departure Date: ${request.departureDate}
Return Date: ${request.returnDate}

Return JSON in this exact shape:
{
  "itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Short theme",
      "morning": "Morning plan",
      "afternoon": "Afternoon plan",
      "evening": "Evening plan",
      "restaurant": "Restaurant suggestion",
      "transport": "Transport suggestion"
    }
  ]
}`
      }
    ]
  });

  const parsed = extractJson<ItineraryResponse>(response.output_text);
  return parsed?.itinerary?.length ? parsed.itinerary : null;
}

export async function createTripPlan(request: TripRequest): Promise<TripPlan> {
  const itinerary = attachItineraryPhotos(
    request,
    (await generateAiItinerary(request).catch(() => null)) ?? buildMockItinerary(request)
  );

  return {
    request,
    visa: getVisaInfo(request),
    itinerary,
    weather: buildWeather(request),
    budget: buildBudget(request),
    checklist: buildChecklist(request),
    reservationLinks: buildReservationLinks(request)
  };
}

export async function reviseItinerary(
  plan: TripPlan,
  messages: ChatMessage[]
): Promise<{ reply: string; itinerary: ItineraryDay[] }> {
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user");

  if (!openai) {
    return {
      reply:
        "I updated the plan conceptually for your preference. Add an OpenAI API key to enable live itinerary rewriting.",
      itinerary: applySimpleRevision(plan.itinerary, lastUserMessage?.content ?? "")
    };
  }

  const response = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content:
          "You revise travel itineraries. Return strict JSON only with a short reply and the full updated itinerary."
      },
      {
        role: "user",
        content: `Trip context:
${JSON.stringify(plan.request)}

Current itinerary:
${JSON.stringify(plan.itinerary)}

Conversation:
${JSON.stringify(messages)}

Return JSON in this exact shape:
{
  "reply": "Short helpful confirmation",
  "itinerary": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "title": "Short theme",
      "morning": "Morning plan",
      "afternoon": "Afternoon plan",
      "evening": "Evening plan",
      "restaurant": "Restaurant suggestion",
      "transport": "Transport suggestion"
    }
  ]
}`
      }
    ]
  });

  const parsed = extractJson<{ reply: string; itinerary: ItineraryDay[] }>(response.output_text);

  if (!parsed?.itinerary?.length) {
    return {
      reply: "I could not safely rewrite the full itinerary, so I kept the current plan in place.",
      itinerary: plan.itinerary
    };
  }

  return {
    reply: parsed.reply,
    itinerary: preserveItineraryPhotos(plan.itinerary, parsed.itinerary)
  };
}

function attachItineraryPhotos(request: TripRequest, itinerary: ItineraryDay[]): ItineraryDay[] {
  const photos = buildTripPhotos(request);

  return itinerary.map((day, index) => ({
    ...day,
    photo: day.photo ?? photos[index % photos.length]
  }));
}

function preserveItineraryPhotos(
  currentItinerary: ItineraryDay[],
  updatedItinerary: ItineraryDay[]
): ItineraryDay[] {
  return updatedItinerary.map((day, index) => {
    const currentDay = currentItinerary.find((item) => item.day === day.day) ?? currentItinerary[index];

    return {
      ...day,
      photo: day.photo ?? currentDay?.photo
    };
  });
}

function applySimpleRevision(itinerary: ItineraryDay[], request: string): ItineraryDay[] {
  const lower = request.toLowerCase();

  return itinerary.map((day) => {
    if (lower.includes("museum")) {
      return {
        ...day,
        afternoon: day.afternoon.replace(/museum|gallery/gi, "local neighbourhood walk")
      };
    }

    if (lower.includes("hiking") || lower.includes("nature")) {
      return {
        ...day,
        morning: "Start with an easy nature walk or nearby scenic trail.",
        afternoon: day.afternoon
      };
    }

    if (lower.includes("children") || lower.includes("kids")) {
      return {
        ...day,
        afternoon: "Choose a family-friendly attraction with breaks built in.",
        restaurant: "Pick a casual restaurant with simple dishes and flexible seating."
      };
    }

    if (lower.includes("budget")) {
      return {
        ...day,
        restaurant: "Choose a local casual restaurant, market stall, or set-menu option.",
        transport: "Prioritise public transport and walking where practical."
      };
    }

    return day;
  });
}
