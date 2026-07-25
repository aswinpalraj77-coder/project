import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/format';

export interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  label?: string;
  type?: 'station' | 'incident' | 'hotspot' | 'sos';
  riskScore?: number;
}

interface MapViewProps {
  markers: MapMarker[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: number;
  onMarkerClick?: (m: MapMarker) => void;
  showRisk?: boolean;
  className?: string;
}

const stationIcon = L.divIcon({
  html: `<div style="background:#284473;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:14px;">🚓</div>`,
  className: '',
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const incidentIcon = L.divIcon({
  html: `<div style="background:#dc2626;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,0.3);font-size:12px;">⚠</div>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const sosIcon = L.divIcon({
  html: `<div style="background:#dc2626;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2.5px solid #fff;box-shadow:0 0 0 4px rgba(220,38,38,0.3);font-size:14px;font-weight:bold;">SOS</div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

function hotspotIcon(riskScore: number): L.DivIcon {
  const color = riskScore >= 75 ? '#dc2626' : riskScore >= 50 ? '#f99207' : riskScore >= 30 ? '#3b82f6' : '#12b157';
  const size = 24 + (riskScore / 100) * 16;
  return L.divIcon({
    html: `<div style="background:${color};opacity:0.85;color:#fff;width:${size}px;height:${size}px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);font-size:10px;font-weight:bold;">${riskScore}%</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

export function MapView({ markers, center, zoom = 12, height = 360, onMarkerClick, showRisk, className }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // compute center from markers if not provided
  const defaultCenter = center || (markers.length > 0
    ? { lat: markers.reduce((s, m) => s + m.lat, 0) / markers.length, lng: markers.reduce((s, m) => s + m.lng, 0) / markers.length }
    : { lat: 12.9716, lng: 77.5946 });

  // init map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [defaultCenter.lat, defaultCenter.lng],
      zoom,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update center when markers change
  useEffect(() => {
    if (!mapRef.current) return;
    if (center) {
      mapRef.current.setView([center.lat, center.lng], zoom);
    } else if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng] as [number, number]));
      if (markers.length > 1) {
        mapRef.current.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
      } else {
        mapRef.current.setView([markers[0].lat, markers[0].lng], zoom);
      }
    }
  }, [markers, center, zoom]);

  // update markers
  useEffect(() => {
    if (!mapRef.current) return;
    // clear existing
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    markers.forEach((m) => {
      let icon = incidentIcon;
      if (m.type === 'station') icon = stationIcon;
      else if (m.type === 'sos') icon = sosIcon;
      else if (m.type === 'hotspot' && m.riskScore !== undefined) icon = hotspotIcon(m.riskScore);

      const marker = L.marker([m.lat, m.lng], { icon }).addTo(mapRef.current!);
      if (m.label) {
        marker.bindPopup(`<strong>${m.label}</strong>${m.type === 'hotspot' && m.riskScore !== undefined ? `<br/>Risk: ${m.riskScore}%` : ''}`);
      }
      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(m));
      }
      markersRef.current.push(marker);
    });
  }, [markers, onMarkerClick, showRisk]);

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden rounded-xl border border-navy-200 dark:border-navy-800', className)}
      style={{ height, width: '100%' }}
    />
  );
}
