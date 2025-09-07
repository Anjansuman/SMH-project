"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

type Props = {
  onNavigate: (from: [number, number], to: [number, number], route: [number, number][]) => void;
};

export default function NavigateTo({ onNavigate }: Props) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNavigate = async () => {
    if (!from || !to) return;
    setLoading(true);

    try {
      const res = await fetch("https://smh-project.onrender.com/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: from, destination: to }),
      });

      const data = await res.json();

      if (data.error) {
        alert(data.error);
      } else {
        // Convert [lon, lat] → [lat, lon] for Leaflet
        const convertedCoords: [number, number][] = data.route_coords.map(
          (c: [number, number]) => [c[1], c[0]]
        );

        // Send back to parent (Navigation.tsx)
        onNavigate(convertedCoords[0], convertedCoords[convertedCoords.length - 1], convertedCoords);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch route.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute bottom-6 right-6 z-[99999] w-80 bg-neutral-950 border border-neutral-800 p-4 rounded-xl shadow-lg flex flex-col gap-3 select-none">
      <div className="text-white text-lg font-light text-center">Navigate</div>

      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2">
        <MapPin size={18} className="text-purple-500" />
        <input
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          placeholder="Start location (e.g. Delhi)"
          className="bg-transparent w-full text-white placeholder:text-neutral-500 focus:outline-none"
        />
      </div>

      <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2">
        <MapPin size={18} className="text-green-500" />
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="Destination (e.g. Mumbai)"
          className="bg-transparent w-full text-white placeholder:text-neutral-500 focus:outline-none"
        />
      </div>

      <button
        onClick={handleNavigate}
        disabled={loading}
        className="bg-neutral-900 text-white font-medium py-2 rounded-lg transition cursor-pointer disabled:opacity-50"
      >
        {loading ? "Loading..." : "Go"}
      </button>
    </div>
  );
}
