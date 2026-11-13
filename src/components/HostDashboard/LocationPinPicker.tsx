import React, { useEffect, useRef, useState } from 'react';
import { Map, Marker, NavigationControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapPin, Locate, Crosshair } from 'lucide-react';

interface LocationPinPickerProps {
  lat: number;
  lng: number;
  onChange: (lat: number, lng: number) => void;
  city?: string;
}

export const LocationPinPicker: React.FC<LocationPinPickerProps> = ({
  lat,
  lng,
  onChange,
  city = 'New Delhi'
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markerRef = useRef<Marker | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number }>({ lat, lng });

  // 1. Initialize MapLibre with OpenFreeMap Positron Style
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initialCenter: [number, number] = [lng || 77.2090, lat || 28.6139];

    const map = new Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: initialCenter,
      zoom: 13,
      attributionControl: false
    });

    map.addControl(new NavigationControl({ showCompass: false }), 'top-right');

    // Create Custom Draggable Pin Element
    const el = document.createElement('div');
    el.className = 'custom-pin-picker relative cursor-grab active:cursor-grabbing flex flex-col items-center justify-center select-none';
    el.innerHTML = `
      <div class="relative flex items-center justify-center -translate-y-4">
        <div class="w-10 h-10 rounded-full bg-[#123C3A] border-2 border-[#19C7B1] shadow-2xl flex items-center justify-center text-white">
          <svg class="w-5 h-5 fill-current text-[#19C7B1]" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div class="absolute -bottom-2 w-3 h-3 rotate-45 bg-[#123C3A] border-r-2 border-b-2 border-[#19C7B1]"></div>
        <div class="absolute -bottom-4 w-4 h-1.5 rounded-full bg-black/25 blur-[1px]"></div>
      </div>
    `;

    const marker = new Marker({ element: el, draggable: true })
      .setLngLat(initialCenter)
      .addTo(map);

    // On Drag
    marker.on('drag', () => {
      const lngLat = marker.getLngLat();
      const updatedLat = Math.round(lngLat.lat * 100000) / 100000;
      const updatedLng = Math.round(lngLat.lng * 100000) / 100000;
      setCurrentCoords({ lat: updatedLat, lng: updatedLng });
    });

    // On Drag End
    marker.on('dragend', () => {
      const lngLat = marker.getLngLat();
      const updatedLat = Math.round(lngLat.lat * 100000) / 100000;
      const updatedLng = Math.round(lngLat.lng * 100000) / 100000;
      setCurrentCoords({ lat: updatedLat, lng: updatedLng });
      onChange(updatedLat, updatedLng);
    });

    // Click on map to place pin
    map.on('click', (e) => {
      const { lng: clickLng, lat: clickLat } = e.lngLat;
      const updatedLat = Math.round(clickLat * 100000) / 100000;
      const updatedLng = Math.round(clickLng * 100000) / 100000;
      marker.setLngLat([clickLng, clickLat]);
      setCurrentCoords({ lat: updatedLat, lng: updatedLng });
      onChange(updatedLat, updatedLng);
    });

    map.on('load', () => {
      setMapLoaded(true);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Update center when props change externally
  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;
    if (lat && lng && (lat !== currentCoords.lat || lng !== currentCoords.lng)) {
      markerRef.current.setLngLat([lng, lat]);
      mapRef.current.flyTo({ center: [lng, lat], zoom: 14, duration: 800 });
      setCurrentCoords({ lat, lng });
    }
  }, [lat, lng]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = Math.round(pos.coords.latitude * 100000) / 100000;
        const uLng = Math.round(pos.coords.longitude * 100000) / 100000;
        if (mapRef.current && markerRef.current) {
          markerRef.current.setLngLat([uLng, uLat]);
          mapRef.current.flyTo({ center: [uLng, uLat], zoom: 15, duration: 1000 });
        }
        setCurrentCoords({ lat: uLat, lng: uLng });
        onChange(uLat, uLng);
      },
      () => {},
      { timeout: 8000 }
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <label className="font-bold text-[#123C3A] dark:text-[#E4EFEA] flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#19C7B1]" />
          <span>Pin Location on OpenFreeMap</span>
        </label>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="text-[11px] font-bold text-[#19C7B1] hover:text-[#123C3A] dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Locate className="w-3 h-3" />
          <span>My Location</span>
        </button>
      </div>

      <div className="relative w-full h-56 rounded-xl overflow-hidden border border-[#D9DED5] dark:border-[#183E3A] shadow-inner bg-[#EAE5D7] dark:bg-[#071715]">
        <div ref={mapContainerRef} className="w-full h-full" />

        {/* Selected Coords Readout Floating Pill */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 flex items-center justify-between px-3 py-1.5 rounded-lg bg-white/95 dark:bg-[#0D2422]/95 backdrop-blur-md border border-[#D9DED5] dark:border-[#183E3A] text-[11px] shadow-md font-mono">
          <div className="flex items-center gap-1.5 text-[#123C3A] dark:text-[#E4EFEA] font-semibold">
            <Crosshair className="w-3.5 h-3.5 text-[#19C7B1]" />
            <span>Lat: <span className="text-[#19C7B1] font-bold">{currentCoords.lat.toFixed(5)}</span></span>
            <span className="text-[#B8C2B3] dark:text-[#183E3A]">|</span>
            <span>Lng: <span className="text-[#19C7B1] font-bold">{currentCoords.lng.toFixed(5)}</span></span>
          </div>
          <span className="text-[10px] text-[#5E716E] dark:text-[#8FAFA9] font-sans font-medium hidden sm:inline">
            Drag pin or tap map
          </span>
        </div>
      </div>
    </div>
  );
};
