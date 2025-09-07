"use client";

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import NavigateTo from "./NavigateTo";

// Fix for default marker icons not loading in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});


export default function Navigation() {
    const [position, setPosition] = useState<[number, number]>([28.6139, 77.209]);

    return (
        <div className="h-full w-full rounded-lg border border-neutral-700 bg-black overflow-hidden flex flex-col relative">
            <NavigateTo />
            <div className="flex-1">
                <MapContainer
                    center={position}
                    zoom={5}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={position}>
                        <Popup>Selected Location</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}
