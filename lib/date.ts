export function getTripDates(departureDate: string, returnDate: string): string[] {
  const start = parseDateOnly(departureDate);
  const end = parseDateOnly(returnDate);

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
    day: "numeric",
    timeZone: "UTC"
  }).format(parseDateOnly(date));
}

export function calculateNights(departureDate: string, returnDate: string): number {
  const start = parseDateOnly(departureDate);
  const end = parseDateOnly(returnDate);
  return Math.max(1, Math.round((end.getTime() - start.getTime()) / 86_400_000));
}

function parseDateOnly(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}
