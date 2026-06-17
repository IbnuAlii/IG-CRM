'use client';

import React, { useEffect, useState } from 'react';
import { GeoLocation } from '@/types';
import { MapPin, Navigation } from 'lucide-react';

interface LiveMapProps {
  pickupLocation: GeoLocation & { address: string };
  dropoffLocation: GeoLocation & { address: string };
  driverLocation?: GeoLocation;
  customerLocation?: GeoLocation;
  className?: string;
}

export function LiveMap({
  pickupLocation,
  dropoffLocation,
  driverLocation,
  customerLocation,
  className = 'h-96',
}: LiveMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`${className} bg-muted rounded-lg flex items-center justify-center`}>
        <div className="text-center">
          <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10;
  };

  const distance = calculateDistance(
    pickupLocation.latitude,
    pickupLocation.longitude,
    dropoffLocation.latitude,
    dropoffLocation.longitude
  );

  return (
    <div className={`${className} bg-gradient-to-br from-muted via-background to-muted rounded-lg relative overflow-hidden`}>
      {/* SVG Map Canvas */}
      <svg width="100%" height="100%" className="w-full h-full">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border" />
          </pattern>
        </defs>
        
        {/* Grid background */}
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Calculate SVG coordinates from lat/lng */}
        {(() => {
          const bounds = {
            minLat: Math.min(
              pickupLocation.latitude,
              dropoffLocation.latitude,
              driverLocation?.latitude || pickupLocation.latitude
            ) - 0.02,
            maxLat: Math.max(
              pickupLocation.latitude,
              dropoffLocation.latitude,
              driverLocation?.latitude || pickupLocation.latitude
            ) + 0.02,
            minLng: Math.min(
              pickupLocation.longitude,
              dropoffLocation.longitude,
              driverLocation?.longitude || pickupLocation.longitude
            ) - 0.02,
            maxLng: Math.max(
              pickupLocation.longitude,
              dropoffLocation.longitude,
              driverLocation?.longitude || pickupLocation.longitude
            ) + 0.02,
          };

          const width = 100;
          const height = 100;

          const latToY = (lat: number) => {
            return ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * height;
          };

          const lngToX = (lng: number) => {
            return ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * width;
          };

          const pickupX = lngToX(pickupLocation.longitude);
          const pickupY = latToY(pickupLocation.latitude);
          const dropoffX = lngToX(dropoffLocation.longitude);
          const dropoffY = latToY(dropoffLocation.latitude);
          const driverX = driverLocation ? lngToX(driverLocation.longitude) : pickupX;
          const driverY = driverLocation ? latToY(driverLocation.latitude) : pickupY;

          return (
            <>
              {/* Route line */}
              <line
                x1={`${pickupX}%`}
                y1={`${pickupY}%`}
                x2={`${dropoffX}%`}
                y2={`${dropoffY}%`}
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                strokeDasharray="5,5"
              />

              {/* Driver route if available */}
              {driverLocation && (
                <line
                  x1={`${driverX}%`}
                  y1={`${driverY}%`}
                  x2={`${pickupX}%`}
                  y2={`${pickupY}%`}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-accent"
                />
              )}

              {/* Pickup marker */}
              <g transform={`translate(${pickupX}%, ${pickupY}%)`}>
                <circle r="6" fill="currentColor" className="text-primary" />
                <circle r="10" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary opacity-50" />
              </g>

              {/* Dropoff marker */}
              <g transform={`translate(${dropoffX}%, ${dropoffY}%)`}>
                <rect x="-6" y="-6" width="12" height="12" fill="currentColor" className="text-destructive" />
                <rect x="-10" y="-10" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1" className="text-destructive opacity-50" />
              </g>

              {/* Driver marker */}
              {driverLocation && (
                <g transform={`translate(${driverX}%, ${driverY}%)`}>
                  <polygon points="0,-8 6,8 0,4 -6,8" fill="currentColor" className="text-accent" />
                  <circle r="12" fill="none" stroke="currentColor" strokeWidth="1" className="text-accent opacity-50" />
                </g>
              )}
            </>
          );
        })()}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm border border-border rounded-lg p-3 text-sm space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <span className="text-xs text-muted-foreground">Pickup</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-destructive"></div>
          <span className="text-xs text-muted-foreground">Dropoff</span>
        </div>
        {driverLocation && (
          <div className="flex items-center gap-2">
            <Navigation className="w-3 h-3 text-accent" />
            <span className="text-xs text-muted-foreground">Driver</span>
          </div>
        )}
        <div className="pt-2 border-t border-border mt-2">
          <p className="text-xs text-muted-foreground">Distance: <span className="font-bold text-foreground">{distance} km</span></p>
        </div>
      </div>
    </div>
  );
}
