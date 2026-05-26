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
    radiusKm: number;
    onJobClick?: (jobId: number) => void;
};

const BANGKOK_CENTER: [number, number] = [13.7551, 100.5018];

export default function JobMapLeaflet({ jobs, mapHeight, userLocation, radiusKm, onJobClick }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<any>(null);
    const circleRef = useRef<any>(null);          // live-update on radius change
    const markersLayerRef = useRef<any>(null);    // re-render markers when jobs change

    // ── Init map once ─────────────────────────────────────────────────────────
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

            // "You are here" marker + radius circle
            if (userLocation) {
                const circle = L.default.circle([userLocation.lat, userLocation.lng], {
                    radius: radiusKm === 0 ? 0 : radiusKm * 1000,
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: radiusKm === 0 ? 0 : 0.06,
                    weight: radiusKm === 0 ? 0 : 2,
                    dashArray: '6 4',
                }).addTo(map);
                circleRef.current = circle;

                const youIcon = L.default.divIcon({
                    className: '',
                    html: `
                        <div style="position:relative;width:20px;height:20px;">
                            <div style="position:absolute;inset:0;border-radius:50%;background:rgba(59,130,246,0.3);animation:pulse 2s infinite;"></div>
                            <div style="position:absolute;top:3px;left:3px;right:3px;bottom:3px;border-radius:50%;background:#3b82f6;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
                        </div>
                        <style>@keyframes pulse{0%,100%{transform:scale(1);opacity:0.6}50%{transform:scale(2);opacity:0}}</style>
                    `,
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                    popupAnchor: [0, -14],
                });
                L.default.marker([userLocation.lat, userLocation.lng], { icon: youIcon })
                    .addTo(map)
                    .bindPopup('<strong>📍 ตำแหน่งของคุณ</strong>');
            }

            // Create a LayerGroup for job markers so we can swap them later
            const group = L.default.layerGroup().addTo(map);
            markersLayerRef.current = group;
        });

        return () => {
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
                circleRef.current = null;
                markersLayerRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ── Live-update radius circle when radiusKm changes ───────────────────────
    useEffect(() => {
        const circle = circleRef.current;
        if (!circle) return;
        if (radiusKm === 0) {
            circle.setRadius(0);
            circle.setStyle({ weight: 0, fillOpacity: 0 });
        } else {
            circle.setRadius(radiusKm * 1000);
            circle.setStyle({ weight: 2, fillOpacity: 0.06 });
        }
    }, [radiusKm]);

    // ── Re-render job markers when jobs list changes ──────────────────────────
    useEffect(() => {
        const group = markersLayerRef.current;
        if (!group) return;

        import('leaflet').then((L) => {
            group.clearLayers();

            const typeColorMap: Record<string, string> = {
                'งานด่วน': '#ef4444',
                'เซฟโซน': '#ec4899',
                'Premium': '#f59e0b',
                'ฟูลไทม์': '#3b82f6',
                'พาร์ทไทม์': '#22c55e',
            };

            const avatarIcon = (color: string, job: Job) => {
                const content = job.photo
                    ? `<img src="${job.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`
                    : `<span style="font-size:16px;font-weight:700;color:${color}">${job.title.charAt(0)}</span>`;
                return L.default.divIcon({
                    className: '',
                    html: `
                      <div style="display:flex;flex-direction:column;align-items:center;width:48px;">
                        <div style="width:44px;height:44px;border-radius:50%;border:3px solid ${color};background:#fff;overflow:hidden;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.25);">${content}</div>
                        <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;border-top:10px solid ${color};margin-top:-1px;"></div>
                      </div>`,
                    iconSize: [48, 54],
                    iconAnchor: [24, 54],
                    popupAnchor: [0, -56],
                });
            };

            jobs.forEach((job) => {
                const color = typeColorMap[job.type] ?? '#64748b';
                const marker = L.default.marker([job.lat, job.lng], { icon: avatarIcon(color, job) })
                    .bindPopup(`
                        <div style="min-width:180px;font-family:sans-serif;">
                            <h4 style="font-weight:700;margin:0 0 4px;font-size:13px;color:#0f172a">${job.title}</h4>
                            <p style="font-size:12px;color:#64748b;margin:2px 0">${job.company}</p>
                            <p style="font-size:12px;color:#64748b;margin:2px 0">⭐ ${job.rating} • ${job.distance}</p>
                            <p style="font-size:14px;font-weight:700;color:#16a34a;margin:6px 0 10px">${job.salary}</p>
                            <a href="/workboard/${job.id}" style="display:block;text-align:center;background:#2563eb;color:#fff;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:700;text-decoration:none;">ดูรายละเอียด →</a>
                        </div>
                    `, { maxWidth: 220 });

                // Double-click marker → navigate directly
                marker.on('dblclick', () => {
                    if (onJobClick) onJobClick(job.id);
                    else window.location.href = `/workboard/${job.id}`;
                });

                group.addLayer(marker);
            });
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [jobs]);

    return (
        <div
            ref={mapRef}
            style={{ height: mapHeight, width: '100%' }}
        />
    );
}
