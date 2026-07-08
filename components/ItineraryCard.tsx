import { formatDisplayDate } from "@/lib/date";
import type { ItineraryDay } from "@/types/trip";
import { SectionCard } from "@/components/ui/SectionCard";

export function ItineraryCard({ itinerary }: { itinerary: ItineraryDay[] }) {
  return (
    <SectionCard title="AI Trip Planner" eyebrow="Itinerary">
      <div className="space-y-4">
        {itinerary.map((day) => (
          <article
            className="overflow-hidden rounded-3xl border border-line bg-white"
            key={`${day.day}-${day.date}`}
          >
            {day.photo ? (
              <div className="relative aspect-[16/9] bg-mist md:aspect-[21/8]">
                <img
                  alt={`${day.photo.title} in ${day.photo.location}`}
                  className="h-full w-full object-cover"
                  loading={day.day === 1 ? "eager" : "lazy"}
                  src={day.photo.imageUrl}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                  <p className="text-sm font-semibold">{day.photo.title}</p>
                  <p className="mt-1 text-xs text-white/80">
                    {day.photo.location} · {day.photo.credit}
                  </p>
                </div>
              </div>
            ) : null}
            <div className="p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-ocean">Day {day.day}</p>
                <h3 className="text-lg font-semibold text-ink">{day.title}</h3>
              </div>
              <span className="rounded-full bg-mist px-3 py-1 text-sm text-slate-600">
                {formatDisplayDate(day.date)}
              </span>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <PlanBlock label="Morning" value={day.morning} />
              <PlanBlock label="Afternoon" value={day.afternoon} />
              <PlanBlock label="Evening" value={day.evening} />
            </div>
            <div className="mt-3 grid gap-3 md:grid-cols-2">
              <PlanBlock label="Restaurant" value={day.restaurant} />
              <PlanBlock label="Transport" value={day.transport} />
            </div>
            </div>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}

function PlanBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-mist p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="text-sm leading-6 text-ink">{value}</p>
    </div>
  );
}
