"use client";

import { MapContainer, TileLayer, CircleMarker, Polyline, useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";

interface DestinationMapProps {
  originLat: number;
  originLng: number;
  destinationLat: number | null;
  destinationLng: number | null;
  onSelect: (lat: number, lng: number) => void;
}

function MapClickHandler({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event: LeafletMouseEvent) {
      onSelect(event.latlng.lat, event.latlng.lng);
    },
  });
  return null;
}

export function DestinationMap({
  originLat,
  originLng,
  destinationLat,
  destinationLng,
  onSelect,
}: DestinationMapProps) {
  const centerLat = destinationLat ?? originLat;
  const centerLng = destinationLng ?? originLng;
  const hasDestination = destinationLat !== null && destinationLng !== null;

  return (
    <div className="rounded-md border overflow-hidden">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={hasDestination ? 15 : 7}
        className="h-48 w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapClickHandler onSelect={onSelect} />
        <CircleMarker center={[originLat, originLng]} radius={7} pathOptions={{ color: "#1e3a8a" }} />
        {hasDestination && (
          <>
            <CircleMarker
              center={[destinationLat, destinationLng]}
              radius={7}
              pathOptions={{ color: "#ef4444" }}
            />
            <Polyline
              positions={[
                [originLat, originLng],
                [destinationLat, destinationLng],
              ]}
              pathOptions={{ color: "#1e3a8a", dashArray: "6 6" }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
