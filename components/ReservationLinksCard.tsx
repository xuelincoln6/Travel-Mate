import type { ReservationLink } from "@/types/trip";
import { SectionCard } from "@/components/ui/SectionCard";

export function ReservationLinksCard({ links }: { links: ReservationLink[] }) {
  return (
    <SectionCard title="Reservation Links" eyebrow="Book">
      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link) => (
          <article className="rounded-2xl bg-mist p-4" key={link.id}>
            <h3 className="font-semibold text-ink">{link.label}</h3>
            <p className="mt-2 min-h-12 text-sm leading-6 text-slate-600">{link.description}</p>
            <a
              className="mt-4 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-ink ring-1 ring-line transition hover:text-ocean"
              href={link.url}
              rel="noreferrer"
              target="_blank"
            >
              Book Now
            </a>
          </article>
        ))}
      </div>
    </SectionCard>
  );
}
