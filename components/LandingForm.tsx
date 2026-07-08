"use client";

import { useState } from "react";
import type { TripRequest } from "@/types/trip";

type LandingFormProps = {
  onSubmit: (request: TripRequest) => Promise<void>;
  isLoading: boolean;
  error?: string;
};

const today = new Date().toISOString().slice(0, 10);

export function LandingForm({ onSubmit, isLoading, error }: LandingFormProps) {
  const [form, setForm] = useState<TripRequest>({
    nationality: "China Passport",
    destination: "Japan",
    departureDate: today,
    returnDate: today
  });

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-ocean">
            One Search. One Trip.
          </p>
          <h1 className="text-4xl font-semibold tracking-normal text-ink md:text-6xl">
            Travel Mate
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Generate visa guidance, a day-by-day itinerary, weather, budget, checklist, and
            booking links from one simple search.
          </p>
        </div>

        <form
          className="rounded-[2rem] border border-line bg-white p-5 shadow-soft md:p-8"
          onSubmit={(event) => {
            event.preventDefault();
            void onSubmit(form);
          }}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Passport / Nationality
              </span>
              <input
                className="w-full rounded-2xl border border-line bg-mist px-4 py-3 text-ink"
                placeholder="China Passport"
                value={form.nationality}
                onChange={(event) => setForm({ ...form, nationality: event.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Destination</span>
              <input
                className="w-full rounded-2xl border border-line bg-mist px-4 py-3 text-ink"
                placeholder="Japan"
                value={form.destination}
                onChange={(event) => setForm({ ...form, destination: event.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">
                Departure Date
              </span>
              <input
                className="w-full rounded-2xl border border-line bg-mist px-4 py-3 text-ink"
                type="date"
                value={form.departureDate}
                onChange={(event) => setForm({ ...form, departureDate: event.target.value })}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Return Date</span>
              <input
                className="w-full rounded-2xl border border-line bg-mist px-4 py-3 text-ink"
                type="date"
                value={form.returnDate}
                onChange={(event) => setForm({ ...form, returnDate: event.target.value })}
              />
            </label>
          </div>

          {error ? (
            <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            className="mt-6 w-full rounded-2xl bg-ink px-5 py-4 text-base font-semibold text-white shadow-soft transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isLoading}
            type="submit"
          >
            {isLoading ? "Generating..." : "Generate My Trip"}
          </button>
        </form>
      </div>
    </main>
  );
}
