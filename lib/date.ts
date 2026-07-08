export function getTripDates(departureDate: string, returnDate: string): string[] {
  const start = new Date(`${departureDate}T00:00:00`);
  const end = new Date(`${returnDate}T00:00:00`);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end < start) {
    throw new Error("Return date must be on or after departure date.");
  }

  const dates: string[] = [];
  const current = new Date(start);

  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export function formatDisplayDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric"
  }).format(new Date(`${date}T00:00:00`));
}

export function calculateNights(departureDate: string, returnDate: string): number {
  const start = new Date(`${departureDate}T00:00:00`);
  const end = new Date(`${returnDate}T00:00:00`);
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}
