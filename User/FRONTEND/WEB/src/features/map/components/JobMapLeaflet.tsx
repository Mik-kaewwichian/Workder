'use client';

import { useEffect, useRef } from 'react';

type Job = {
    id: number;
    title: string;
    company: string;
    salary: string;
    type: string;
    rating: number;
    distance: string;
    lat: number;
    lng: number;
    photo?: string;
};

type UserLocation = { lat: number; lng: number };

type Props = {
    jobs: Job[];
    mapHeight: number;
    userLocation: UserLocation | null;
};

const BANGKOK_CENTER: [number, number] = [13.7551, 100.5018];
const RADIUS_M = 10000;

export default function JobMapLeaflet({ jobs, mapHeight, userLocation }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<any>(null);

    useEffect(() => {
        if (!mapRef.current || leafletMapRef.current) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const center: [number, number] = userLocation
            ? [userLocation.lat, userLocation.lng]
            : BANGKOK_CENTER;

        import('leaflet').then((L) => {
            if (!mapRef.current || leafletMapRef.current) return;

            const map = L.default.map(mapRef.current).setView(center, 14);
            leafletMapRef.current = map;

            L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            if (userLocation) {
                // 10km radius boundary circle
                L.default.circle([userLocation.lat, userLocation.lng], {
                    radius: RADIUS_M,
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.06,
                    weight: 2,
                    dashArray: '6 4',
                }).addTo(map);

                // "You are here" pulsing dot marker
                const youIcon = L.default.divIcon({
                    className: '',
                    html: `
                        <div style="position:relative;width:20px;height:20px;">
                            <div style="
                                position:absolute;inset:0;
                                border-radius:50%;
                                background:rgba(59,130,246,0.3);
                                animation:pulse 2s infinite;
                            "></div>
                            <div style="
                                position:absolute;top:3px;left:3px;right:3px;bottom:3px;
                                border-radius:50%;
                                background:#3b82f6;
                                border:2px solid white;
                                box-shadow:0 2px 6px rgba(0,0,0,0.3);
                            "></div>
                        </div>
                        <style>
                            @keyframes pulse {
                                0%,100%{transform:scale(1);opacity:0.6}
                                50%{transform:scale(2);opacity:0}
                            }
                        </style>
                    `,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                    popupAnchor: [0, -14],
                });

                L.default.marker([userLocation.lat, userLocation.lng], { icon: youIcon })
                    .addTo(map)
                    .bindPopup('<strong>📍 ตำแหน่งของคุณ</strong>');
            }

            // Avatar-style teardrop marker
            const avatarIcon = (color: string, job: Job) => {
                const content = job.photo
                    ? `<img src="${job.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`
                    : `<span style="font-size:16px;font-weight:700;color:${color}">${job.title.charAt(0)}</span>`;
                return L.default.divIcon({
                    className: '',
                    html: `
                      <div style="display:flex;flex-direction:column;align-items:center;width:48px;">
                        <div style="
                          width:44px;height:44px;border-radius:50%;
                          border:3px solid ${color};
                          background:#fff;
                          overflow:hidden;
                          display:flex;align-items:center;justify-content:center;
                          box-shadow:0 2px 8px rgba(0,0,0,0.25);
                        ">${content}</div>
                        <div style="
                          width:0;height:0;
                          border-left:7px solid transparent;
                          border-right:7px solid transparent;
                          border-top:10px solid ${color};
                          margin-top:-1px;
                        "></div>
                      </div>`,
                    iconSize: [48, 54],
                    iconAnchor: [24, 54],
                    popupAnchor: [0, -56],
                });
            };

            const typeColorMap: Record<string, string> = {
                'งานด่วน': '#ef4444',
                'Safezone': '#ec4899',
                'Premium': '#f59e0b',
                'Full-time': '#3b82f6',
                'Part-time': '#22c55e',
            };

            jobs.forEach((job) => {
                const color = typeColorMap[job.type] ?? '#64748b';
                L.default.marker([job.lat, job.lng], { icon: avatarIcon(color, job) })
                    .addTo(map)
                    .bindPopup(`
                        <div style="min-width:160px">
                            <h4 style="font-weight:bold;margin-bottom:4px">${job.title}</h4>
                            <p style="font-size:12px;color:#666;margin:2px 0">${job.company}</p>
                            <p style="font-size:12px;color:#666;margin:2px 0">⭐ ${job.rating} • ${job.distance}</p>
                            <p style="font-size:12px;font-weight:bold;color:#16a34a;margin:4px 0 0">${job.salary}</p>
                        </div>
                    `);
            });
        });

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, []);

    return (
        <div
            ref={mapRef}
            style={{ height: mapHeight, width: '100%' }}
        />
    );
}
