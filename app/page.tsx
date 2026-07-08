"use client";

import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { LandingForm } from "@/components/LandingForm";
import type { TripPlan, TripRequest } from "@/types/trip";

export default function Home() {
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function generateTrip(request: TripRequest) {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      });
      const data = (await response.json()) as { plan?: TripPlan; error?: string };

      if (!response.ok || !data.plan) {
        throw new Error(data.error ?? "Unable to generate your trip.");
      }

      setPlan(data.plan);
    } catch (tripError) {
      setError(tripError instanceof Error ? tripError.message : "Unable to generate your trip.");
    } finally {
      setIsLoading(false);
    }
  }

  if (plan) {
    return (
      <Dashboard
        plan={plan}
        onPlanChange={setPlan}
        onStartOver={() => {
          setPlan(null);
          setError("");
        }}
      />
    );
  }

  return <LandingForm error={error} isLoading={isLoading} onSubmit={generateTrip} />;
}
