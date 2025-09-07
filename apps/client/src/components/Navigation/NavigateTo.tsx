"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

export default function NavigateTo() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");

    const handleNavigate = () => {
        if (!from || !to) return;
        console.log("Navigate from:", from, "to:", to);
        // Later: plug into Leaflet routing machine or API
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
                    placeholder="start location"
                    className="bg-transparent w-full text-white placeholder:text-neutral-500 focus:outline-none"
                />
            </div>

            <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2">
                <MapPin size={18} className="text-green-500" />
                <input
                    type="text"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    placeholder="destination"
                    className="bg-transparent w-full text-white placeholder:text-neutral-500 focus:outline-none"
                />
            </div>

            <button
                onClick={handleNavigate}
                className="bg-neutral-900 text-white font-medium py-2 rounded-lg transition cursor-pointer"
            >
                Go
            </button>
        </div>
    );
}
