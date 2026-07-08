import { formatDisplayDate } from "@/lib/date";
import type { WeatherDay } from "@/types/trip";
import { SectionCard } from "@/components/ui/SectionCard";

export function WeatherCard({ weather }: { weather: WeatherDay[] }) {
  return (
    <SectionCard title="Weather" eyebrow="Forecast">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {weather.map((day) => (
          <div className="rounded-2xl bg-mist p-4" key={day.date}>
            <p className="font-semibold text-ink">{formatDisplayDate(day.date)}</p>
            <p className="mt-2 text-sm text-slate-600">{day.condition}</p>
            <p className="mt-4 text-2xl font-semibold text-ink">
              {day.highC}° <span className="text-base font-medium text-slate-500">/ {day.lowC}°C</span>
            </p>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
