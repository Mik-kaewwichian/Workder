import React from 'react';
import WorkerMap from '../../../features/map/components/WorkerMap';

export default function EmployerMapPage() {
    return (
        <>
            {/* Navbar might be overlaid or hidden on map view, keeping for consistency but WorkerMap has its own header */}
            {/* <Navbar /> */}
            <WorkerMap />
        </>
    );
}
