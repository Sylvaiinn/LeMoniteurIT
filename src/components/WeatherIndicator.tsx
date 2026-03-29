"use client";

import { useEffect, useState } from "react";

interface WeatherData {
  weatherLevel: "CALM" | "AGITATED" | "STORM";
}

const WEATHER_CONFIG = {
  CALM: { icon: "☀️", label: "Calme", className: "weather-calm" },
  AGITATED: { icon: "🌤️", label: "Agité", className: "weather-agitated" },
  STORM: { icon: "⛈️", label: "Tempête", className: "weather-storm" },
};

export default function WeatherIndicator() {
  const [weather, setWeather] = useState<WeatherData>({ weatherLevel: "CALM" });

  useEffect(() => {
    fetch("/api/mood")
      .then((r) => r.json())
      .then((data) => setWeather({ weatherLevel: data.weatherLevel || "CALM" }))
      .catch(() => {});
  }, []);

  const config = WEATHER_CONFIG[weather.weatherLevel];

  return (
    <div className="flex items-center gap-2" title={`Météo de l'IA : ${config.label}`}>
      <span className={`text-lg ${config.className}`}>{config.icon}</span>
      <span className="text-xs font-medium tracking-wider uppercase text-ink-muted hidden sm:inline">
        {config.label}
      </span>
    </div>
  );
}
