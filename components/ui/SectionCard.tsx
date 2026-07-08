type SectionCardProps = {
  title: string;
  eyebrow?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
};

export function SectionCard({ title, eyebrow, children, action }: SectionCardProps) {
  return (
    <section className="rounded-3xl border border-line bg-white/90 p-5 shadow-soft backdrop-blur md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-ocean">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="text-xl font-semibold text-ink">{title}</h2>
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
