const baseUrl = process.env.TEST_BASE_URL ?? "http://127.0.0.1:3000";

const requests = [
  {
    nationality: "China Passport",
    destination: "Japan",
    departureDate: "2026-10-01",
    returnDate: "2026-10-04"
  },
  {
    nationality: "China Passport",
    destination: "France",
    departureDate: "2026-10-01",
    returnDate: "2026-10-04"
  }
];

async function createTrip(request) {
  const response = await fetch(`${baseUrl}/api/trip`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request)
  });

  const data = await response.json();

  if (!response.ok || !data.plan) {
    throw new Error(data.error ?? `Trip generation failed for ${request.destination}`);
  }

  return data.plan;
}

function itineraryText(plan) {
  return plan.itinerary
    .map((day) =>
      [day.title, day.morning, day.afternoon, day.evening, day.restaurant, day.transport].join(" ")
    )
    .join(" ")
    .toLowerCase();
}

function assertContains(label, text, terms) {
  const hasTerm = terms.some((term) => text.includes(term));

  if (!hasTerm) {
    throw new Error(`${label} itinerary did not contain any of: ${terms.join(", ")}`);
  }
}

const [japan, france] = await Promise.all(requests.map(createTrip));
const japanText = itineraryText(japan);
const franceText = itineraryText(france);

assertContains("Japan", japanText, ["tokyo", "shinjuku", "shibuya", "kyoto", "ramen", "shinkansen"]);
assertContains("France", franceText, ["paris", "seine", "louvre", "eiffel", "metro", "croissant"]);

if (japanText === franceText) {
  throw new Error("Japan and France itineraries were identical.");
}

if (japan.itinerary[0]?.date !== "2026-10-01" || france.itinerary[0]?.date !== "2026-10-01") {
  throw new Error("Generated itineraries did not preserve the requested departure date.");
}

console.log("Japan sample:");
console.log(japan.itinerary[0]);
console.log("France sample:");
console.log(france.itinerary[0]);
console.log("Trip generation comparison passed.");
