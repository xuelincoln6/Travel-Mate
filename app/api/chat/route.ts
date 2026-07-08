import { NextResponse } from "next/server";
import { reviseItinerary } from "@/services/tripService";
import type { ChatMessage, TripPlan } from "@/types/trip";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      plan?: TripPlan;
      messages?: ChatMessage[];
    };

    if (!body.plan || !body.messages?.length) {
      throw new Error("A trip plan and chat message are required.");
    }

    const result = await reviseItinerary(body.plan, body.messages);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update itinerary." },
      { status: 400 }
    );
  }
}
