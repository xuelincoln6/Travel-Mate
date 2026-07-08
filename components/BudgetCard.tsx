import type { BudgetEstimate } from "@/types/trip";
import { SectionCard } from "@/components/ui/SectionCard";

export function BudgetCard({ budget }: { budget: BudgetEstimate }) {
  const items = [
    ["Flights", budget.flights],
    ["Hotel", budget.hotel],
    ["Food", budget.food],
    ["Transport", budget.transport],
    ["Activities", budget.activities]
  ];

  return (
    <SectionCard title="Budget Estimation" eyebrow="Costs">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map(([label, value]) => (
          <div className="rounded-2xl bg-mist p-4" key={label}>
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-semibold text-ink">
              {budget.currency} {Number(value).toLocaleString()}
            </p>
          </div>
        ))}
        <div className="rounded-2xl bg-ink p-4 text-white">
          <p className="text-sm text-white/70">Total estimated cost</p>
          <p className="mt-2 text-2xl font-semibold">
            {budget.currency} {budget.total.toLocaleString()}
          </p>
        </div>
      </div>
    </SectionCard>
  );
}
