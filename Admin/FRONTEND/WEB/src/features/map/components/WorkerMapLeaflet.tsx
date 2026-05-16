'use client';

import { useEffect, useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';

type Worker = {
    id: number;
    name: string;
    skill: string;
    rating: number;
    distance: string;
    price: string;
    lat: number;
    lng: number;
    photo?: string;
};

type Props = {
    workers: Worker[];
    mapHeight: number;
    trackedId: number | null;
};

const EMPLOYER: [number, number] = [13.7551, 100.5018];

function haversineKm(a: [number, number], b: [number, number]) {
    const R = 6371;
    const dLat = ((b[0] - a[0]) * Math.PI) / 180;
    const dLng = ((b[1] - a[1]) * Math.PI) / 180;
    const h =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((a[0] * Math.PI) / 180) * Math.cos((b[0] * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.asin(Math.sqrt(h));
}

function etaLabel(km: number) {
    const mins = Math.round((km / 30) * 60);
    if (mins < 1) return 'ถึงแล้ว!';
    if (mins < 60) return `~${mins} นาที`;
    return `~${Math.floor(mins / 60)} ชม. ${mins % 60} นาที`;
}

function buildWorkerIcon(L: any, worker: Worker) {
    const content = worker.photo
        ? `<img src="${worker.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`
        : `<span style="font-size:16px;font-weight:700;color:#ef4444">${worker.name.charAt(0)}</span>`;
    return L.divIcon({
        className: '',
        html: `<div style="display:flex;flex-direction:column;align-items:center;width:48px;">
            <div style="width:44px;height:44px;border-radius:50%;border:3px solid #ef4444;background:#fff;
                overflow:hidden;display:flex;align-items:center;justify-content:center;
                box-shadow:0 2px 8px rgba(0,0,0,0.25);">${content}</div>
            <div style="width:0;height:0;border-left:7px solid transparent;border-right:7px solid transparent;
                border-top:10px solid #ef4444;margin-top:-1px;"></div>
        </div>`,
        iconSize: [48, 54],
        iconAnchor: [24, 54],
        popupAnchor: [0, -56],
    });
}

/** Fetch road waypoints from OSRM public API */
async function fetchRoute(from: [number, number], to: [number, number]): Promise<[number, number][]> {
    try {
        const url = `https://router.project-osrm.org/route/v1/driving/` +
            `${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.routes?.[0]?.geometry?.coordinates) {
            // OSRM returns [lng, lat] — flip to [lat, lng]
            return data.routes[0].geometry.coordinates.map(([lng, lat]: [number, number]) => [lat, lng]);
        }
    } catch (e) { /* fallback to straight line */ }
    // fallback: just 2 points
    return [from, to];
}

export default function WorkerMapLeaflet({ workers, mapHeight, trackedId }: Props) {
    const mapRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const leafletMapRef = useRef<any>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const markersRef = useRef<Record<number, any>>({});
    const routeLineRef = useRef<any>(null);    // full route line (grey)
    const progressLineRef = useRef<any>(null);   // remaining route (blue dashed)
    const etaPopupRef = useRef<any>(null);
    const animRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const trackedIdRef = useRef<number | null>(null);
    const routePointsRef = useRef<[number, number][]>([]);
    const stepRef = useRef(0);

    // ─── init map (runs once) ───────────────────────────────────────────────
    useEffect(() => {
        if (!mapRef.current || leafletMapRef.current) return;

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        import('leaflet').then((L) => {
            if (!mapRef.current || leafletMapRef.current) return;
            const map = L.default.map(mapRef.current).setView(EMPLOYER, 15);
            leafletMapRef.current = map;

            L.default.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            }).addTo(map);

            // Home marker (employer)
            const homeIcon = L.default.divIcon({
                className: '',
                html: `<div style="display:flex;flex-direction:column;align-items:center;width:44px;">
                    <div style="width:40px;height:40px;border-radius:50%;border:3px solid #2563eb;background:#eff6ff;
                        display:flex;align-items:center;justify-content:center;
                        box-shadow:0 2px 8px rgba(0,0,0,0.2);font-size:18px;">🏠</div>
                    <div style="width:0;height:0;border-left:6px solid transparent;border-right:6px solid transparent;
                        border-top:8px solid #2563eb;margin-top:-1px;"></div>
                </div>`,
                iconSize: [44, 48], iconAnchor: [22, 48], popupAnchor: [0, -50],
            });
            L.default.marker(EMPLOYER, { icon: homeIcon }).addTo(map)
                .bindPopup('<strong>📍 ตำแหน่งของคุณ</strong>');

            // Place all worker markers at initial positions
            workers.forEach((worker) => {
                const pos: [number, number] = [worker.lat, worker.lng];
                const marker = L.default.marker(pos, { icon: buildWorkerIcon(L.default, worker) }).addTo(map);
                markersRef.current[worker.id] = marker;
            });
        });

        return () => {
            if (animRef.current) clearInterval(animRef.current);
            if (leafletMapRef.current) {
                leafletMapRef.current.remove();
                leafletMapRef.current = null;
            }
        };
    }, []);

    // ─── react to trackedId changes ─────────────────────────────────────────
    useEffect(() => {
        trackedIdRef.current = trackedId;
        const map = leafletMapRef.current;
        if (!map) return;

        // clear previous animation / lines
        if (animRef.current) { clearInterval(animRef.current); animRef.current = null; }
        if (routeLineRef.current) { routeLineRef.current.remove(); routeLineRef.current = null; }
        if (progressLineRef.current) { progressLineRef.current.remove(); progressLineRef.current = null; }
        if (etaPopupRef.current) { etaPopupRef.current.remove(); etaPopupRef.current = null; }

        if (trackedId === null) return;

        const worker = workers.find((w) => w.id === trackedId);
        if (!worker) return;

        const startPos: [number, number] = [worker.lat, worker.lng];

        import('leaflet').then(async (L) => {
            // Fetch road route
            const pts = await fetchRoute(startPos, EMPLOYER);
            routePointsRef.current = pts;
            stepRef.current = 0;

            // Draw full grey route background
            routeLineRef.current = L.default.polyline(pts, {
                color: '#94a3b8', weight: 4, opacity: 0.4,
            }).addTo(map);

            // Fit map to route
            map.fitBounds(routeLineRef.current.getBounds(), { padding: [60, 60] });

            const updateDisplay = () => {
                const step = stepRef.current;
                const pos = routePointsRef.current[step];
                if (!pos) return;

                // Remaining route (blue dashed)
                const remaining = routePointsRef.current.slice(step);
                if (progressLineRef.current) progressLineRef.current.remove();
                progressLineRef.current = L.default.polyline(remaining, {
                    color: '#2563eb', weight: 5, opacity: 0.9, dashArray: '10 6',
                }).addTo(map);

                // Move worker marker
                if (markersRef.current[trackedId]) {
                    markersRef.current[trackedId].setLatLng(pos);
                }

                // ETA popup at midpoint of remaining
                const midIdx = Math.floor((step + routePointsRef.current.length - 1) / 2);
                const midPt = routePointsRef.current[midIdx] ?? pos;
                const km = haversineKm(pos, EMPLOYER);

                if (etaPopupRef.current) etaPopupRef.current.remove();
                etaPopupRef.current = L.default.popup({ closeButton: false, autoClose: false, closeOnClick: false })
                    .setLatLng(midPt)
                    .setContent(`
                        <div style="text-align:center;min-width:120px">
                            <div style="font-size:11px;color:#64748b;margin-bottom:2px">⏱ ETA</div>
                            <div style="font-size:15px;font-weight:700;color:#2563eb">${etaLabel(km)}</div>
                            <div style="font-size:10px;color:#94a3b8">${km < 1 ? `${Math.round(km * 1000)} ม.` : `${km.toFixed(2)} กม.`}</div>
                        </div>`)
                    .openOn(map);
            };

            updateDisplay();

            // Advance marker along route every 1.5 s (skip 2 points per tick for demo speed)
            const STEP_SIZE = Math.max(1, Math.floor(pts.length / 40)); // ~40 steps to reach destination
            animRef.current = setInterval(() => {
                if (trackedIdRef.current !== trackedId) return;
                const next = stepRef.current + STEP_SIZE;
                if (next >= routePointsRef.current.length - 1) {
                    stepRef.current = routePointsRef.current.length - 1;
                    updateDisplay();
                    clearInterval(animRef.current!);
                    return;
                }
                stepRef.current = next;
                updateDisplay();
            }, 1500);
        });
    }, [trackedId]);

    // ─── handle fullscreen ───────────────────────────────────────────────
    const handleFullscreen = async () => {
        if (!isFullscreen) {
            try {
                if (containerRef.current?.requestFullscreen) {
                    await containerRef.current.requestFullscreen();
                    setIsFullscreen(true);
                }
            } catch (err) {
                console.error('Fullscreen failed:', err);
            }
        } else {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            }
            setIsFullscreen(false);
        }
    };

    // Listen for fullscreen changes (e.g., ESC key)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, []);

    return (
        <div 
            ref={containerRef}
            style={{
                position: 'relative',
                height: isFullscreen ? '100vh' : mapHeight,
                width: '100%',
                top: isFullscreen ? 0 : 'auto',
                left: isFullscreen ? 0 : 'auto',
                zIndex: isFullscreen ? 9999 : 'auto',
            }}
        >
            <button
                onClick={handleFullscreen}
                className="bg-white rounded-lg p-2 shadow-lg hover:bg-gray-100 transition-colors"
                style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10000 }}
                title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
                {isFullscreen ? (
                    <Minimize2 className="w-5 h-5 text-gray-700" />
                ) : (
                    <Maximize2 className="w-5 h-5 text-gray-700" />
                )}
            </button>
            <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
        </div>
    );
}
