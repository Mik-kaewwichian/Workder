'use client';

import React from 'react';
import { MapPin } from 'lucide-react';

export default function MapPreview() {
    // Mock data for pins
    const pins = [
        { id: 1, x: '20%', y: '30%', color: 'text-pink-500', bg: 'bg-pink-100', type: 'Safezone' },
        { id: 2, x: '50%', y: '40%', color: 'text-blue-500', bg: 'bg-blue-100', type: 'Normal' },
        { id: 3, x: '70%', y: '20%', color: 'text-amber-500', bg: 'bg-amber-100', type: 'Premium' },
        { id: 4, x: '40%', y: '60%', color: 'text-green-500', bg: 'bg-green-100', type: 'Part-time' },
        { id: 5, x: '80%', y: '70%', color: 'text-red-500', bg: 'bg-red-100', type: 'Urgent' },
    ];

    return (
        <div className="relative w-full h-full min-h-[300px] bg-slate-100 rounded-3xl overflow-hidden group">
            {/* Map Background (Simplified/Abstract) */}
            <div className="absolute inset-0 opacity-40">
                {/* Horizontal Roads */}
                <div className="absolute top-[35%] w-full h-4 bg-slate-300 transform -rotate-2"></div>
                <div className="absolute top-[65%] w-full h-3 bg-slate-300 transform rotate-1"></div>

                {/* Vertical Roads */}
                <div className="absolute left-[30%] h-full w-4 bg-slate-300 transform rotate-6"></div>
                <div className="absolute left-[65%] h-full w-3 bg-slate-300 transform -rotate-3"></div>

                {/* Parks/Areas */}
                <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-green-200/50 rounded-full"></div>
                <div className="absolute bottom-[20%] right-[10%] w-40 h-40 bg-blue-200/50 rounded-full"></div>
            </div>

            {/* Pins */}
            {pins.map((pin) => (
                <div
                    key={pin.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-125 hover:z-10 group-hover:animate-bounce`}
                    style={{ left: pin.x, top: pin.y, animationDelay: `${pin.id * 100}ms` }}
                >
                    <div className={`relative ${pin.color}`}>
                        <MapPin className={`h-8 w-8 fill-current drop-shadow-md`} />
                        <div className={`absolute inset-0 ${pin.bg} blur-md opacity-50 rounded-full animate-ping`}></div>
                    </div>
                </div>
            ))}


        </div>
    );
}
