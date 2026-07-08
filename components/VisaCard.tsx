import { SectionCard } from "@/components/ui/SectionCard";
import type { VisaInfo } from "@/types/trip";

export function VisaCard({ visa }: { visa: VisaInfo }) {
  const facts = [
    ["Destination", visa.destination],
    ["Visa requirement", visa.requirement],
    ["Visa-free days", visa.visaFreeDays ? `${visa.visaFreeDays} days` : "Check by passport"],
    ["Passport validity", visa.passportValidity],
    ["Return ticket", visa.returnTicket],
    ["Travel insurance", visa.insurance]
  ];

  return (
    <SectionCard title="Visa Information" eyebrow="Entry">
      <div className="grid gap-3">
        {facts.map(([label, value]) => (
          <div
            className="grid gap-1 rounded-2xl bg-mist px-4 py-3 md:grid-cols-[11rem_1fr] md:gap-4"
            key={label}
          >
            <span className="text-sm font-medium text-slate-500">{label}</span>
            <span className="text-sm leading-6 text-ink">{value}</span>
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {visa.officialUrl ? (
          <a
            className="rounded-full border border-line px-4 py-2 text-sm font-semibold text-ink transition hover:border-ocean hover:text-ocean"
            href={visa.officialUrl}
            rel="noreferrer"
            target="_blank"
          >
            Official Visa Information
          </a>
        ) : null}
        {visa.eVisaUrl ? (
          <a
            className="rounded-full bg-ocean px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
            href={visa.eVisaUrl}
            rel="noreferrer"
            target="_blank"
          >
            Apply eVisa
          </a>
        ) : null}
      </div>
    </SectionCard>
  );
}
