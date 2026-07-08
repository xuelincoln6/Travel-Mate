"use client";

import { BudgetCard } from "@/components/BudgetCard";
import { ChatPanel } from "@/components/ChatPanel";
import { ChecklistCard } from "@/components/ChecklistCard";
import { ItineraryCard } from "@/components/ItineraryCard";
import { ReservationLinksCard } from "@/components/ReservationLinksCard";
import { VisaCard } from "@/components/VisaCard";
import { WeatherCard } from "@/components/WeatherCard";
import type { TripPlan } from "@/types/trip";

type DashboardProps = {
  plan: TripPlan;
  onPlanChange: (plan: TripPlan) => void;
  onStartOver: () => void;
};

export function Dashboard({ plan, onPlanChange, onStartOver }: DashboardProps) {
  return (
    <main className="mx-auto min-h-screen max-w-7xl px-4 py-6 md:px-6 lg:py-8">
      <header className="mb-6 flex flex-col gap-4 rounded-3xl border border-line bg-white/80 p-5 shadow-soft backdrop-blur md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.2em] text-ocean">
            One Search. One Trip.
          </p>
          <h1 className="text-3xl font-semibold text-ink md:text-5xl">
            {plan.request.destination}
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600 md:text-base">
            {plan.request.nationality} · {plan.request.departureDate} to {plan.request.returnDate}
          </p>
        </div>
        <button
          className="self-start rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:border-ocean hover:text-ocean md:self-auto"
          onClick={onStartOver}
          type="button"
        >
          New Search
        </button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <VisaCard visa={plan.visa} />
          <ItineraryCard itinerary={plan.itinerary} />
          <WeatherCard weather={plan.weather} />
          <BudgetCard budget={plan.budget} />
          <ChecklistCard checklist={plan.checklist} />
          <ReservationLinksCard links={plan.reservationLinks} />
        </div>
        <ChatPanel plan={plan} onPlanChange={onPlanChange} />
      </div>
    </main>
  );
}
