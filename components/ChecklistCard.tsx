import type { ChecklistItem } from "@/types/trip";
import { SectionCard } from "@/components/ui/SectionCard";

export function ChecklistCard({ checklist }: { checklist: ChecklistItem[] }) {
  return (
    <SectionCard title="Travel Checklist" eyebrow="Prepare">
      <div className="grid gap-3 sm:grid-cols-2">
        {checklist.map((item) => (
          <label
            className="flex min-h-14 items-center gap-3 rounded-2xl bg-mist px-4 py-3 text-sm font-medium text-ink"
            key={item.id}
          >
            <input className="h-4 w-4 accent-ocean" type="checkbox" defaultChecked={item.required} />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
    </SectionCard>
  );
}
