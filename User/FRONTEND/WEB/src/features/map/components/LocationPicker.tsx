'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

type LatLng = { lat: number; lng: number };

type Props = {
    value: LatLng | null;
    onChange: (pos: LatLng) => void;
    height?: number;
};

const BANGKOK: [number, number] = [13.7551, 100.5018];

export default function LocationPicker({ value, onChange, height = 280 }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markerRef = useRef<any>(null);
    const [locating, setLocating] = useState(false);

    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        // Inject Leaflet CSS once
        if (!document.querySelector('link[data-leaflet]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            link.setAttribute('data-leaflet', '1');
            document.head.appendChild(link);
        }

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = () => initMap();
        // If already loaded (script tag exists), init immediately
        if ((window as any).L) {
            initMap();
            return;
        }
        document.head.appendChild(script);

        function initMap() {
            const L = (window as any).L;
            if (!containerRef.current) return;

            const center: [number, number] = value ? [value.lat, value.lng] : BANGKOK;
            const map = L.map(containerRef.current, { zoomControl: true }).setView(center, 14);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap',
            }).addTo(map);

            // Custom red pin icon
            const pinIcon = L.divIcon({
                className: '',
                html: `<div style="
                    width:36px; height:36px;
                    background:#2563eb;
                    border:3px solid white;
                    border-radius:50% 50% 50% 0;
                    transform:rotate(-45deg);
                    box-shadow:0 2px 8px rgba(0,0,0,0.35);
                    position:relative;
                "><div style="
                    width:10px; height:10px;
                    background:white;
                    border-radius:50%;
                    position:absolute;
                    top:50%; left:50%;
                    transform:translate(-50%,-50%) rotate(45deg);
                "></div></div>`,
                iconSize: [36, 36],
                iconAnchor: [18, 36],
            });

            // Place initial marker if value exists
            if (value) {
                markerRef.current = L.marker([value.lat, value.lng], { icon: pinIcon, draggable: true }).addTo(map);
                markerRef.current.on('dragend', () => {
                    const { lat, lng } = markerRef.current.getLatLng();
                    onChange({ lat, lng });
                });
            }

            // Click on map → place/move pin
            map.on('click', (e: any) => {
                const { lat, lng } = e.latlng;
                if (markerRef.current) {
                    markerRef.current.setLatLng([lat, lng]);
                } else {
                    markerRef.current = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(map);
                    markerRef.current.on('dragend', () => {
                        const pos = markerRef.current.getLatLng();
                        onChange({ lat: pos.lat, lng: pos.lng });
                    });
                }
                onChange({ lat, lng });
            });

            mapRef.current = map;
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
                markerRef.current = null;
            }
        };
    }, []);

    // Move marker programmatically when value prop changes externally
    useEffect(() => {
        if (!mapRef.current || !markerRef.current || !value) return;
        markerRef.current.setLatLng([value.lat, value.lng]);
        mapRef.current.setView([value.lat, value.lng], mapRef.current.getZoom());
    }, [value?.lat, value?.lng]);

    const handleLocateMe = () => {
        if (!navigator.geolocation) return;
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lng } = pos.coords;
                setLocating(false);
                onChange({ lat, lng });
                if (mapRef.current) {
                    mapRef.current.setView([lat, lng], 16);
                    const L = (window as any).L;
                    if (markerRef.current) {
                        markerRef.current.setLatLng([lat, lng]);
                    } else {
                        const pinIcon = L.divIcon({
                            className: '',
                            html: `<div style="width:36px;height:36px;background:#2563eb;border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.35);position:relative;"><div style="width:10px;height:10px;background:white;border-radius:50%;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%) rotate(45deg);"></div></div>`,
                            iconSize: [36, 36],
                            iconAnchor: [18, 36],
                        });
                        markerRef.current = L.marker([lat, lng], { icon: pinIcon, draggable: true }).addTo(mapRef.current);
                        markerRef.current.on('dragend', () => {
                            const p = markerRef.current.getLatLng();
                            onChange({ lat: p.lat, lng: p.lng });
                        });
                    }
                }
            },
            () => setLocating(false),
            { timeout: 8000 }
        );
    };

    return (
        <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 focus-within:border-blue-500 transition-colors">
            {/* Map canvas */}
            <div ref={containerRef} style={{ height, width: '100%' }} />

            {/* Locate me button */}
            <button
                type="button"
                onClick={handleLocateMe}
                disabled={locating}
                className="absolute bottom-3 right-3 z-[999] flex items-center gap-1.5 bg-white border border-slate-200 shadow-md rounded-lg px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50 hover:border-blue-400 transition-colors disabled:opacity-60"
            >
                <Navigation size={13} className={locating ? 'animate-pulse text-blue-500' : ''} />
                {locating ? 'กำลังระบุ...' : 'ตำแหน่งของฉัน'}
            </button>

            {/* Hint overlay — only shown when no pin placed */}
            {!value && (
                <div className="absolute inset-0 z-[500] flex items-center justify-center pointer-events-none">
                    <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg flex items-center gap-2 text-sm font-medium text-slate-600">
                        <MapPin size={16} className="text-blue-500" />
                        แตะบนแผนที่เพื่อปักหมุดสถานที่
                    </div>
                </div>
            )}
        </div>
    );
}
