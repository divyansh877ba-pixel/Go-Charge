import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Map, Marker, Popup, AttributionControl } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Plus, Minus, Navigation, Compass, Layers, Zap, ArrowRight, 
  LocateFixed, Search, AlertCircle, CheckCircle2, X, Bike, Car, Building2, Home
} from 'lucide-react';
import { Station } from '../../types';
import { USER_CURRENT_LOCATION, calculateDistance, INDIAN_CITIES_COORDINATES } from '../../data/mockStations';

interface ChargingMapProps {
  stations: Station[];
  selectedStation: Station | null;
  onSelectStation: (station: Station) => void;
  onViewStationDetails: (station: Station) => void;
  onGetDirections: (station: Station) => void;
  isListView?: boolean;
  onToggleViewMode?: () => void;
}

// OpenFreeMap vector styles - 100% free, unlimited, no API key required
const OPEN_FREE_MAP_STYLES = {
  positron: {
    name: 'Sand / Positron',
    url: 'https://tiles.openfreemap.org/styles/positron',
    description: 'Minimal warm light style matching Sand palette'
  },
  liberty: {
    name: 'Liberty Vector',
    url: 'https://tiles.openfreemap.org/styles/liberty',
    description: 'Rich vector details with 3D buildings'
  },
  bright: {
    name: 'Bright',
    url: 'https://tiles.openfreemap.org/styles/bright',
    description: 'Vibrant high-contrast streets'
  }
};

type StyleKey = keyof typeof OPEN_FREE_MAP_STYLES;

interface StationCluster {
  id: string;
  label: string;
  lat: number;
  lng: number;
  stations: Station[];
  availablePorts: number;
  totalPorts: number;
}

// Geographic proximity clustering helper for national/regional zoom levels
function computeClusters(stationList: Station[], maxDistanceKm = 85): StationCluster[] {
  const clusters: StationCluster[] = [];
  const assigned = new Set<string>();

  for (const station of stationList) {
    if (assigned.has(station.id)) continue;

    const clusterStations: Station[] = [station];
    assigned.add(station.id);

    for (const other of stationList) {
      if (assigned.has(other.id)) continue;
      const dist = calculateDistance(station.lat, station.lng, other.lat, other.lng);
      if (dist <= maxDistanceKm) {
        clusterStations.push(other);
        assigned.add(other.id);
      }
    }

    const avgLat = clusterStations.reduce((sum, s) => sum + s.lat, 0) / clusterStations.length;
    const avgLng = clusterStations.reduce((sum, s) => sum + s.lng, 0) / clusterStations.length;

    const areaParts = station.area.split(',');
    const regionName = areaParts.length > 1 ? areaParts[areaParts.length - 1].trim() : station.area;

    clusters.push({
      id: `cluster-${station.id}`,
      label: regionName,
      lat: avgLat,
      lng: avgLng,
      stations: clusterStations,
      availablePorts: clusterStations.reduce((sum, s) => sum + s.availablePorts, 0),
      totalPorts: clusterStations.reduce((sum, s) => sum + s.totalPorts, 0)
    });
  }

  return clusters;
}

export const ChargingMap: React.FC<ChargingMapProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  onViewStationDetails,
  onGetDirections,
  isListView = false,
  onToggleViewMode
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<Map | null>(null);
  const markersRef = useRef<{ [key: string]: Marker }>({});
  const clusterMarkersRef = useRef<{ [key: string]: Marker }>({});
  const userMarkerRef = useRef<Marker | null>(null);
  const activePopupRef = useRef<Popup | null>(null);

  // States
  const [mapLoaded, setMapLoaded] = useState(false);
  const [currentStyle, setCurrentStyle] = useState<StyleKey>('positron');
  const [currentZoom, setCurrentZoom] = useState(11.5);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number }>(USER_CURRENT_LOCATION);
  const [isLocating, setIsLocating] = useState(false);
  const [locationToast, setLocationToast] = useState<{ message: string; type: 'success' | 'warning' } | null>(null);
  const [mapSearch, setMapSearch] = useState('');
  const [styleMenuOpen, setStyleMenuOpen] = useState(false);

  // Helper to show transient toast message
  const showToast = useCallback((message: string, type: 'success' | 'warning' = 'success') => {
    setLocationToast({ message, type });
    setTimeout(() => {
      setLocationToast(null);
    }, 4500);
  }, []);

  // 1. Initialize MapLibre GL centered on DELHI, INDIA (Default Map Location)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default: Connaught Place, New Delhi, India [lng, lat]
    const initialCenter: [number, number] = [77.2090, 28.6139];
    const initialZoom = 11.5;

    const map = new Map({
      container: mapContainerRef.current,
      style: OPEN_FREE_MAP_STYLES[currentStyle].url,
      center: initialCenter,
      zoom: initialZoom,
      pitch: 20,
      bearing: 0,
      attributionControl: false
    });

    // Add minimal custom attribution
    map.addControl(
      new AttributionControl({
        compact: true,
        customAttribution: '© <a href="https://openfreemap.org" target="_blank" rel="noopener">OpenFreeMap</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
      }),
      'bottom-right'
    );

    map.on('load', () => {
      setMapLoaded(true);
      setCurrentZoom(map.getZoom());
    });

    const updateZoom = () => {
      setCurrentZoom(map.getZoom());
    };

    map.on('zoomend', updateZoom);
    map.on('moveend', updateZoom);

    map.on('error', (e: unknown) => {
      console.warn('OpenFreeMap tile event:', e);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // 2. Handle Style Switch (OpenFreeMap Positron / Liberty / Bright)
  const handleStyleChange = (styleKey: StyleKey) => {
    setCurrentStyle(styleKey);
    setStyleMenuOpen(false);
    if (mapRef.current) {
      mapRef.current.setStyle(OPEN_FREE_MAP_STYLES[styleKey].url);
    }
  };

  // 3. User Geolocation Detection ("Find Chargers Near Me")
  const handleFindNearMe = useCallback(() => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'warning');
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        const newCoords = { lat: latitude, lng: longitude };
        setUserCoords(newCoords);

        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [longitude, latitude],
            zoom: 14.5,
            duration: 1500,
            essential: true
          });
        }

        // Find nearest station across all India
        let nearest: Station | null = null;
        let minDistance = Infinity;

        stations.forEach((st) => {
          const d = calculateDistance(latitude, longitude, st.lat, st.lng);
          if (d < minDistance) {
            minDistance = d;
            nearest = st;
          }
        });

        if (nearest) {
          onSelectStation(nearest);
          showToast(`Location detected! Found nearest: ${(nearest as Station).name} (${minDistance.toFixed(1)} km)`, 'success');
        } else {
          showToast('Location detected successfully!', 'success');
        }
      },
      (error) => {
        setIsLocating(false);
        let msg = 'Location access denied. Using default Delhi center. You can search or pan across India.';
        if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out. Using default Delhi center.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Position currently unavailable. Using default Delhi center.';
        }
        showToast(msg, 'warning');
      },
      { enableHighAccuracy: true, timeout: 9000, maximumAge: 30000 }
    );
  }, [stations, onSelectStation, showToast]);

  // 4. Update / Render User Location Marker (Fixed Anchor)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
      userMarkerRef.current = null;
    }

    const el = document.createElement('div');
    el.className = 'user-location-marker-anchor select-none';
    el.style.width = '0px';
    el.style.height = '0px';
    el.innerHTML = `
      <div style="position: absolute; transform: translate(-50%, -50%);" class="flex items-center justify-center pointer-events-none">
        <div class="w-4 h-4 rounded-full bg-[#123C3A] border-2 border-white shadow-lg relative z-10"></div>
        <div class="absolute w-9 h-9 rounded-full bg-[#19C7B1]/35 animate-ping"></div>
        <div class="absolute w-8 h-8 rounded-full bg-[#19C7B1]/20"></div>
      </div>
    `;

    const userMarker = new Marker({ element: el, anchor: 'center' })
      .setLngLat([userCoords.lng, userCoords.lat])
      .addTo(map);

    userMarkerRef.current = userMarker;
  }, [userCoords, mapLoaded]);

  // 5. Open popup for a station ONLY when deliberately triggered
  const openStationPopup = useCallback((station: Station) => {
    const map = mapRef.current;
    if (!map) return;

    if (activePopupRef.current) {
      activePopupRef.current.remove();
    }

    const dist = calculateDistance(userCoords.lat, userCoords.lng, station.lat, station.lng);
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');

    const popupNode = document.createElement('div');
    popupNode.className = `w-72 p-4 rounded-2xl border shadow-2xl transition-colors ${
      isDark 
        ? 'bg-[#0D2422] border-[#1E4844] text-[#E4EFEA]' 
        : 'bg-white border-[#D9DED5] text-[#14201F]'
    }`;

    const statusBadge = station.status === 'available'
      ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#22C55E]/15 text-[#22C55E] border border-[#22C55E]/30">
          <span class="w-2 h-2 rounded-full bg-[#22C55E] shadow-glow-green-sm"></span>
          ${station.availablePorts} of ${station.totalPorts} Ports Free
        </span>`
      : station.status === 'busy'
      ? `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#7A8C89]/15 text-[#5E716E] border border-[#D9DED5]">
          <span class="w-2 h-2 rounded-full bg-[#7A8C89]"></span>
          All ${station.totalPorts} Ports Busy
        </span>`
      : `<span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-[#F59E0B]/15 text-[#D97706] border border-[#F59E0B]/30">
          <span class="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
          ${station.availablePorts}/${station.totalPorts} Ports Free
        </span>`;

    const categoryBadge = station.chargerCategory
      ? `<span class="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
          isDark ? 'bg-[#112D2B] text-[#19C7B1]' : 'bg-[#E9EFE7] text-[#123C3A]'
        }">${station.chargerCategory}</span>`
      : '';

    popupNode.innerHTML = `
      <div class="space-y-3">
        <!-- Top Status Bar -->
        <div class="flex items-center justify-between">
          ${statusBadge}
          <div class="flex items-center gap-1 text-xs font-bold ${isDark ? 'text-white' : 'text-[#123C3A]'}">
            <span class="text-[#F59E0B]">★</span>
            <span class="tabular-nums">${station.rating.toFixed(1)}</span>
            <span class="text-[#5E716E] dark:text-[#88ABA6] font-normal text-[11px]">(${station.reviewsCount})</span>
          </div>
        </div>

        <!-- Name & Area -->
        <div>
          <div class="flex items-center gap-1.5 mb-1">
            ${categoryBadge}
            ${station.verifiedCompatibility ? '<span class="text-[9px] font-bold text-[#22C55E]">✓ Verified</span>' : ''}
          </div>
          <h4 class="font-extrabold text-sm ${isDark ? 'text-white' : 'text-[#123C3A]'} leading-tight mb-1">${station.name}</h4>
          <p class="text-xs ${isDark ? 'text-[#88ABA6]' : 'text-[#5E716E]'} flex items-center gap-1 truncate">
            <svg class="w-3.5 h-3.5 text-[#19C7B1] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            <span class="truncate">${station.area}</span>
          </p>
        </div>

        <!-- Speed & Connectors Info -->
        <div class="p-2.5 rounded-xl ${isDark ? 'bg-[#112D2B] border-[#1E4844]' : 'bg-[#E9EFE7] border-[#D9DED5]'} border flex items-center justify-between text-xs">
          <div class="flex items-center gap-1.5 font-bold ${isDark ? 'text-white' : 'text-[#123C3A]'}">
            <svg class="w-3.5 h-3.5 text-[#19C7B1] fill-current" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            <span class="tabular-nums">${station.powerSpeed}</span>
          </div>
          <span class="text-[11px] font-semibold text-[#19C7B1] ${isDark ? 'bg-[#081B19]' : 'bg-white'} px-2 py-0.5 rounded-pill border ${isDark ? 'border-[#1E4844]' : 'border-[#D9DED5]'}">
            ${station.primaryConnectors.slice(0, 2).join(', ')}
          </span>
        </div>

        <!-- Pricing & Distance -->
        <div class="flex items-center justify-between py-1 border-t ${isDark ? 'border-[#1E4844]' : 'border-[#D9DED5]'} text-xs">
          <div>
            <div class="font-extrabold ${isDark ? 'text-[#19C7B1]' : 'text-[#123C3A]'} flex items-center tabular-nums">
              <span>₹${station.pricePerKwh}/kWh</span>
            </div>
            <div class="text-[10px] ${isDark ? 'text-[#88ABA6]' : 'text-[#5E716E]'} tabular-nums">~₹${station.estimatedFullChargeCost} est. full charge</div>
          </div>
          <div class="text-right">
            <div class="font-bold text-[#19C7B1] tabular-nums">${dist} km</div>
            <div class="text-[10px] ${isDark ? 'text-[#88ABA6]' : 'text-[#5E716E]'}">from you</div>
          </div>
        </div>

        <!-- Action CTA Buttons -->
        <div class="grid grid-cols-2 gap-2 pt-1">
          <button id="popup-directions-btn" class="w-full min-h-[40px] py-2 px-3 rounded-btn ${
            isDark ? 'bg-[#112D2B] hover:bg-[#163836] text-white border-[#1E4844]' : 'bg-[#E9EFE7] hover:bg-white text-[#123C3A] border-[#D9DED5]'
          } font-bold text-xs border transition-colors flex items-center justify-center gap-1 cursor-pointer">
            <svg class="w-3.5 h-3.5 text-[#19C7B1]" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
            Directions
          </button>
          <button id="popup-details-btn" class="w-full min-h-[40px] py-2 px-3 rounded-btn bg-[#19C7B1] hover:bg-[#15A896] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 shadow-glow-teal-sm cursor-pointer">
            View Details
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
        </div>
      </div>
    `;

    popupNode.querySelector('#popup-directions-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      onGetDirections(station);
    });

    popupNode.querySelector('#popup-details-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      onViewStationDetails(station);
    });

    const popup = new Popup({
      offset: 24,
      closeButton: true,
      className: 'custom-openfreemap-popup',
      maxWidth: '320px'
    })
      .setLngLat([station.lng, station.lat])
      .setDOMContent(popupNode)
      .addTo(map);

    activePopupRef.current = popup;
  }, [userCoords, onGetDirections, onViewStationDetails]);

  // 6. Dynamic Viewport Marker Rendering & Clustering Engine (Fixed Coordinates without Drift)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    const isZoomedOut = currentZoom < 8.5;

    if (isZoomedOut) {
      // Clean up individual station markers when in cluster overview
      Object.keys(markersRef.current).forEach(id => {
        markersRef.current[id].remove();
        delete markersRef.current[id];
      });

      // Compute regional clusters
      const clusters = computeClusters(stations, 95);
      const activeClusterIds = new Set(clusters.map(c => c.id));

      // Remove clusters no longer active
      Object.keys(clusterMarkersRef.current).forEach(id => {
        if (!activeClusterIds.has(id)) {
          clusterMarkersRef.current[id].remove();
          delete clusterMarkersRef.current[id];
        }
      });

      // Render or update cluster badges
      clusters.forEach((cluster) => {
        if (clusterMarkersRef.current[cluster.id]) return;

        const el = document.createElement('div');
        el.className = 'custom-cluster-anchor select-none cursor-pointer';
        el.style.width = '0px';
        el.style.height = '0px';
        el.innerHTML = `
          <div style="position: absolute; transform: translate(-50%, -50%);" class="flex flex-col items-center justify-center group">
            <div class="px-3 py-1.5 rounded-full bg-[#123C3A] group-hover:bg-[#19C7B1] text-white border-2 border-white shadow-xl flex items-center gap-1.5 transition-colors">
              <svg class="w-3.5 h-3.5 text-[#19C7B1] group-hover:text-white fill-current" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <span class="font-extrabold text-xs tabular-nums">${cluster.stations.length}</span>
            </div>
            <div class="mt-1 px-2.5 py-0.5 rounded-full bg-[#F4F1E8] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-[10px] font-bold text-[#123C3A] dark:text-white shadow-sm whitespace-nowrap">
              ${cluster.label}
            </div>
          </div>
        `;

        el.addEventListener('click', (e) => {
          e.stopPropagation();
          map.flyTo({
            center: [cluster.lng, cluster.lat],
            zoom: 11.5,
            duration: 1200,
            essential: true
          });
        });

        const marker = new Marker({ element: el, anchor: 'center' })
          .setLngLat([cluster.lng, cluster.lat])
          .addTo(map);

        clusterMarkersRef.current[cluster.id] = marker;
      });

    } else {
      // Zoomed in (>= 8.5): Clean up cluster badges and render individual station markers
      Object.keys(clusterMarkersRef.current).forEach(id => {
        clusterMarkersRef.current[id].remove();
        delete clusterMarkersRef.current[id];
      });

      // Filter stations within current visible viewport bounds + buffer
      const bounds = map.getBounds();
      const visibleStations = bounds
        ? stations.filter(st => 
            st.lat >= bounds.getSouth() - 0.5 &&
            st.lat <= bounds.getNorth() + 0.5 &&
            st.lng >= bounds.getWest() - 0.5 &&
            st.lng <= bounds.getEast() + 0.5
          )
        : stations;

      const visibleIds = new Set(visibleStations.map(s => s.id));

      // Remove markers outside viewport
      Object.keys(markersRef.current).forEach(id => {
        if (!visibleIds.has(id)) {
          markersRef.current[id].remove();
          delete markersRef.current[id];
        }
      });

      // Render individual station pins with NO drift
      visibleStations.forEach((station) => {
        const isSelected = selectedStation?.id === station.id;

        // Differentiate categories & availability
        const is2WOnly = station.vehicleTypes.length === 1 && station.vehicleTypes[0] === '2-Wheeler';
        const isHome = station.chargerCategory === 'Home';
        const isFastDC = station.powerSpeed.toLowerCase().includes('dc');

        let markerBg = 'bg-[#22C55E] text-white shadow-glow-green';
        let badgeBg = 'bg-[#123C3A] text-white';

        if (station.status === 'busy') {
          markerBg = 'bg-[#7A8C89] text-white';
          badgeBg = 'bg-[#F4F1E8] text-[#5E716E] border border-[#D9DED5]';
        } else if (station.status === 'partial') {
          markerBg = 'bg-[#F59E0B] text-white';
          badgeBg = 'bg-[#123C3A] text-white';
        }

        if (isSelected) {
          markerBg = 'bg-[#19C7B1] text-white shadow-glow-teal';
        }

        const size = isSelected ? 44 : 36;
        const iconSvg = is2WOnly 
          ? `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.5 9h-2.5l-2-4h-4L9 9H4.5A2.5 2.5 0 0 0 2 11.5v1A2.5 2.5 0 0 0 4.5 15H5a4 4 0 1 0 8 0h3a4 4 0 1 0 8 0h.5a2.5 2.5 0 0 0 2.5-2.5v-1A2.5 2.5 0 0 0 24.5 9h-5zm-11 6a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zm11 0a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/></svg>`
          : isHome
          ? `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>`
          : `<svg class="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>`;

        const existingMarker = markersRef.current[station.id];

        const innerContent = `
          <div style="position: absolute; transform: translate(-50%, -50%);" class="flex items-center justify-center pointer-events-auto">
            <div class="w-[${size}px] h-[${size}px] rounded-full ${markerBg} flex items-center justify-center border-2 border-white dark:border-[#071715] shadow-lg">
              ${iconSvg}
            </div>
            <div class="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full ${badgeBg} font-bold text-[10px] leading-tight flex items-center justify-center shadow-md tabular-nums">
              ${station.availablePorts}
            </div>
            ${isSelected ? `
              <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rotate-45 ${markerBg} border-r-2 border-b-2 border-white dark:border-[#071715]"></div>
            ` : ''}
          </div>
        `;

        if (existingMarker) {
          existingMarker.getElement().innerHTML = innerContent;
        } else {
          const el = document.createElement('div');
          el.className = 'custom-ev-pin-anchor select-none cursor-pointer';
          el.style.width = '0px';
          el.style.height = '0px';
          el.innerHTML = innerContent;

          // Deliberate user click opens compact preview
          el.addEventListener('click', (e) => {
            e.stopPropagation();
            onSelectStation(station);
            openStationPopup(station);
            if (mapRef.current) {
              mapRef.current.flyTo({
                center: [station.lng, station.lat],
                zoom: 15,
                duration: 900
              });
            }
          });

          const marker = new Marker({ element: el, anchor: 'center' })
            .setLngLat([station.lng, station.lat])
            .addTo(map);

          markersRef.current[station.id] = marker;
        }
      });
    }
  }, [stations, selectedStation, mapLoaded, currentZoom, onSelectStation, openStationPopup]);

  // 7. Pan map when selectedStation changes externally (WITHOUT auto-opening popup)
  useEffect(() => {
    if (!mapRef.current || !selectedStation || !mapLoaded) return;

    // Pan smoothly without forcing open popup
    mapRef.current.flyTo({
      center: [selectedStation.lng, selectedStation.lat],
      zoom: 14.5,
      duration: 1000,
      essential: true
    });
  }, [selectedStation, mapLoaded]);

  // 8. In-Map Search & Nationwide City Jump Handler
  const handleMapSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mapSearch.trim() || !mapRef.current) return;

    const q = mapSearch.trim().toLowerCase();

    // 1. Direct station search
    const foundStation = stations.find(s => 
      s.name.toLowerCase().includes(q) || 
      s.area.toLowerCase().includes(q) ||
      s.operator.toLowerCase().includes(q) ||
      s.fullAddress.toLowerCase().includes(q)
    );

    // 2. Nationwide Indian Cities & States coordinates lookup
    const matchedCityKey = Object.keys(INDIAN_CITIES_COORDINATES).find(city => 
      city.includes(q) || q.includes(city)
    );

    if (matchedCityKey) {
      const cityData = INDIAN_CITIES_COORDINATES[matchedCityKey];
      const cityStations = stations.filter(s => 
        s.area.toLowerCase().includes(matchedCityKey) || 
        s.fullAddress.toLowerCase().includes(matchedCityKey) ||
        calculateDistance(cityData.lat, cityData.lng, s.lat, s.lng) < 65
      );

      const targetStation = cityStations[0] || foundStation;

      mapRef.current.flyTo({
        center: [cityData.lng, cityData.lat],
        zoom: cityData.zoom,
        duration: 1400,
        essential: true
      });

      if (targetStation) {
        onSelectStation(targetStation);
        showToast(`Jumped to ${matchedCityKey.toUpperCase()} (${cityStations.length} chargers found)`, 'success');
      } else {
        showToast(`Jumped to ${matchedCityKey.toUpperCase()}`, 'success');
      }
      return;
    }

    if (foundStation) {
      onSelectStation(foundStation);
      mapRef.current.flyTo({
        center: [foundStation.lng, foundStation.lat],
        zoom: 15,
        duration: 1200
      });
      openStationPopup(foundStation);
      showToast(`Found: ${foundStation.name}`, 'success');
      return;
    }

    showToast(`No chargers found matching "${mapSearch}". Try Delhi, Mumbai, Bengaluru, Pune, Jaipur, or Hyderabad.`, 'warning');
  };

  return (
    <div className="relative w-full h-full min-h-[420px] bg-[#EAE5D7] dark:bg-[#071715] overflow-hidden select-none transition-colors">
      
      {/* MapLibre WebGL Canvas Container */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Clean Loading Overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 z-[600] flex flex-col items-center justify-center bg-[#F4F1E8] dark:bg-[#071715] transition-opacity duration-500">
          <div className="relative flex items-center justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-[#E9EFE7] dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] flex items-center justify-center shadow-lg">
              <Zap className="w-7 h-7 text-[#19C7B1] fill-[#19C7B1] animate-pulse" />
            </div>
            <div className="absolute w-18 h-18 rounded-full border-2 border-[#19C7B1]/40 animate-ping"></div>
          </div>
          <h3 className="text-base font-extrabold text-[#123C3A] dark:text-white tracking-tight">
            Loading Go Charge Live Network
          </h3>
          <p className="text-xs text-[#5E716E] dark:text-[#88ABA6] mt-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse"></span>
            Streaming verified Indian charging telemetry...
          </p>
        </div>
      )}

      {/* Floating: In-Map Search & Near Me Banner */}
      <div className="absolute top-4 left-4 right-4 md:right-auto md:left-4 z-[500] pointer-events-auto flex flex-col sm:flex-row gap-2 max-w-xl">
        <form onSubmit={handleMapSearchSubmit} className="relative flex items-center flex-1">
          <Search className="w-4 h-4 text-[#5E716E] dark:text-[#88ABA6] absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
            placeholder="Search any Indian city, area or PIN code..."
            className="w-full pl-9 pr-8 py-2 rounded-pill bg-[#F4F1E8]/95 dark:bg-[#0D2422]/95 backdrop-blur-md text-[#14201F] dark:text-[#E4EFEA] text-xs font-medium border border-[#D9DED5] dark:border-[#1E4844] hover:border-[#19C7B1] focus:border-[#19C7B1] shadow-card-subtle outline-none transition-all placeholder-[#7A8C89] dark:placeholder-[#648782]"
          />
          {mapSearch && (
            <button
              type="button"
              onClick={() => setMapSearch('')}
              className="absolute right-2.5 p-0.5 rounded-full text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <button
          type="button"
          onClick={handleFindNearMe}
          disabled={isLocating}
          className="flex items-center justify-center gap-2 px-4 py-2 rounded-pill bg-[#19C7B1] hover:bg-[#15A896] text-white text-xs font-bold shadow-glow-teal-sm active:scale-95 transition-all whitespace-nowrap cursor-pointer"
        >
          {isLocating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Locating You...</span>
            </>
          ) : (
            <>
              <LocateFixed className="w-3.5 h-3.5" />
              <span>Near Me</span>
            </>
          )}
        </button>

        {/* View Toggle on Mobile: Map vs List */}
        {onToggleViewMode && (
          <button
            type="button"
            onClick={onToggleViewMode}
            className="md:hidden px-3.5 py-2 rounded-pill bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white text-xs font-bold shadow-sm"
          >
            {isListView ? 'Show Map' : 'Show List'}
          </button>
        )}
      </div>

      {/* Floating: Live Station Counter Pill */}
      <div className="absolute top-16 left-4 z-[400] pointer-events-auto hidden sm:block">
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-pill bg-[#F4F1E8]/95 dark:bg-[#0D2422]/95 backdrop-blur-md border border-[#D9DED5] dark:border-[#1E4844] shadow-card-subtle text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E]"></span>
          </span>
          <span className="font-extrabold text-[#123C3A] dark:text-white">
            {stations.length} Chargers Active
          </span>
          <span className="text-[10px] text-[#5E716E] dark:text-[#88ABA6]">
            (Default: Delhi NCR)
          </span>
        </div>
      </div>

      {/* Floating: Transient Location Toast */}
      {locationToast && (
        <div className="absolute top-28 left-4 right-4 sm:right-auto sm:left-4 z-[600] pointer-events-auto animate-in slide-in-from-top duration-300">
          <div className={`p-3 rounded-2xl border shadow-xl flex items-center justify-between gap-3 text-xs max-w-md ${
            locationToast.type === 'success'
              ? 'bg-[#E9EFE7] dark:bg-[#0D2422] border-[#22C55E]/40 text-[#123C3A] dark:text-[#E4EFEA]'
              : 'bg-[#FAF8F3] dark:bg-[#112D2B] border-[#F59E0B]/40 text-[#14201F] dark:text-[#E4EFEA]'
          }`}>
            <div className="flex items-center gap-2">
              {locationToast.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#22C55E] shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0" />
              )}
              <span className="font-medium leading-tight">{locationToast.message}</span>
            </div>
            <button
              onClick={() => setLocationToast(null)}
              className="p-1 rounded-md text-[#5E716E] dark:text-[#88ABA6] hover:text-[#123C3A] dark:hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating: Legend Pill (Bottom Left) */}
      <div className="absolute bottom-6 left-4 z-[400] pb-safe pointer-events-auto">
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-pill bg-[#F4F1E8]/95 dark:bg-[#0D2422]/95 backdrop-blur-md border border-[#D9DED5] dark:border-[#1E4844] shadow-card-subtle text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#22C55E]"></span>
            <span className="text-[11px] font-semibold text-[#14201F] dark:text-[#E4EFEA]">Free</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#7A8C89]"></span>
            <span className="text-[11px] font-semibold text-[#14201F] dark:text-[#E4EFEA]">Busy</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span>
            <span className="text-[11px] font-semibold text-[#14201F] dark:text-[#E4EFEA]">Partial</span>
          </div>
        </div>
      </div>

      {/* Floating: Custom Map Controls (Bottom Right) */}
      <div className="absolute bottom-6 right-5 z-[500] pb-safe flex flex-col gap-2 pointer-events-auto">
        
        {/* Style Switcher Menu Popup */}
        {styleMenuOpen && (
          <div className="mb-2 p-2 rounded-2xl bg-white dark:bg-[#0D2422] border border-[#D9DED5] dark:border-[#1E4844] shadow-xl text-xs space-y-1 w-44">
            <div className="px-2 py-1 font-bold text-[10px] text-[#5E716E] dark:text-[#88ABA6] uppercase tracking-wider">
              Map Vector Style
            </div>
            {(Object.keys(OPEN_FREE_MAP_STYLES) as StyleKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => handleStyleChange(key)}
                className={`w-full min-h-[36px] px-2.5 py-1.5 rounded-lg text-left font-bold text-xs flex items-center justify-between transition-colors cursor-pointer ${
                  currentStyle === key
                    ? 'bg-[#19C7B1] text-white shadow-glow-teal-sm'
                    : 'text-[#123C3A] dark:text-white hover:bg-[#E9EFE7] dark:hover:bg-[#123633]'
                }`}
              >
                <span>{OPEN_FREE_MAP_STYLES[key].name}</span>
                {currentStyle === key && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
              </button>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setStyleMenuOpen(!styleMenuOpen)}
          title="Switch Map Style"
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#0D2422] hover:bg-[#E9EFE7] dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white flex items-center justify-center shadow-card-subtle transition-all active:scale-95 cursor-pointer"
        >
          <Layers className="w-4 h-4 text-[#19C7B1]" />
        </button>

        <button
          type="button"
          onClick={() => mapRef.current?.zoomIn()}
          title="Zoom In"
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#0D2422] hover:bg-[#E9EFE7] dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white flex items-center justify-center shadow-card-subtle transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => mapRef.current?.zoomOut()}
          title="Zoom Out"
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#0D2422] hover:bg-[#E9EFE7] dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white flex items-center justify-center shadow-card-subtle transition-all active:scale-95 cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => mapRef.current?.resetNorthPitch()}
          title="Reset North Orientation"
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#0D2422] hover:bg-[#E9EFE7] dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white flex items-center justify-center shadow-card-subtle transition-all active:scale-95 cursor-pointer"
        >
          <Compass className="w-4 h-4 text-[#5E716E] dark:text-[#88ABA6]" />
        </button>

        <button
          type="button"
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.flyTo({
                center: [userCoords.lng, userCoords.lat],
                zoom: 12,
                duration: 1000
              });
            }
          }}
          title="Recenter on Starting Location"
          className="w-10 h-10 rounded-xl bg-white dark:bg-[#0D2422] hover:bg-[#E9EFE7] dark:hover:bg-[#123633] border border-[#D9DED5] dark:border-[#1E4844] text-[#123C3A] dark:text-white flex items-center justify-center shadow-card-subtle transition-all active:scale-95 cursor-pointer"
        >
          <Navigation className="w-4 h-4 fill-[#19C7B1] text-[#19C7B1]" />
        </button>

      </div>

    </div>
  );
};
