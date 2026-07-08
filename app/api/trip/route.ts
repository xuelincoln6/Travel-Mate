import { NextResponse } from "next/server";
import { createTripPlan } from "@/services/tripService";
import type { TripRequest } from "@/types/trip";

function validateTripRequest(body: Partial<TripRequest>): TripRequest {
  if (!body.nationality || !body.destination || !body.departureDate || !body.returnDate) {
    throw new Error("Please complete nationality, destination, departure date, and return date.");
  }

  const departure = new Date(`${body.departureDate}T00:00:00`);
  const returning = new Date(`${body.returnDate}T00:00:00`);

  if (Number.isNaN(departure.getTime()) || Number.isNaN(returning.getTime())) {
    throw new Error("Please enter valid travel dates.");
  }

  if (returning < departure) {
    throw new Error("Return date must be on or after departure date.");
  }

  return body as TripRequest;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<TripRequest>;
    const tripRequest = validateTripRequest(body);
    const plan = await createTripPlan(tripRequest);

    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to generate trip." },
      { status: 400 }
    );
  }
}
