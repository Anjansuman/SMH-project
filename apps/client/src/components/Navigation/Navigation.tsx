"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import NavigateTo from "./NavigateTo";

// Fix marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Navigation() {
  const [route, setRoute] = useState<[number, number][]>([]);
  const [fromPos, setFromPos] = useState<[number, number] | null>(null);
  const [toPos, setToPos] = useState<[number, number] | null>(null);

  const handleRoute = (from: [number, number], to: [number, number], routeCoords: [number, number][]) => {
    setFromPos(from);
    setToPos(to);
    setRoute(routeCoords);
  };

  return (
    <div className="h-full w-full rounded-lg border border-neutral-700 bg-black overflow-hidden flex flex-col relative">
      <NavigateTo onNavigate={handleRoute} />
      <div className="flex-1">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {fromPos && <Marker position={fromPos}><Popup>Start</Popup></Marker>}
          {toPos && <Marker position={toPos}><Popup>Destination</Popup></Marker>}

          {route.length > 0 && <Polyline positions={route} color="blue" />}
        </MapContainer>
      </div>
    </div>
  );
}
