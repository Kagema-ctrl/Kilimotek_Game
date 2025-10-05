import React from 'react';
import './FarmMap.css';
import { MapContainer, TileLayer, WMSTileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export type ZoneType = 'crop' | 'livestock';

export interface Zone {
  id: string;
  type: ZoneType;
  label: string;
  status: 'normal' | 'irrigated' | 'fertilized' | 'fed';
}

interface FarmMapProps {
  zones: Zone[];
  onZoneAction: (zoneId: string, action: 'irrigate' | 'fertilize' | 'feed') => void;
}

const zoneLocations = [
  { id: 'zone1', lat: -0.615, lon: 37.382, type: 'crop' },
  { id: 'zone2', lat: -0.617, lon: 37.384, type: 'crop' },
  { id: 'zone3', lat: -0.616, lon: 37.383, type: 'livestock' },
];

const FarmMap: React.FC<FarmMapProps> = ({ zones, onZoneAction }) => {
  return (
    <div className="farm-map">
      <MapContainer center={[-0.6167, 37.3833]} zoom={15} style={{ height: '350px', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Digital Earth Africa NDVI WMS overlay */}
        <WMSTileLayer
          url="https://ows.digitalearth.africa/wms?"
          layers="ndvi_anomaly"
          format="image/png"
          transparent
        />
        {zones.map((zone, i) => (
          <Marker
            key={zone.id}
            position={[zoneLocations[i].lat, zoneLocations[i].lon]}
            eventHandlers={{
              click: () => {
                if (zone.type === 'crop') onZoneAction(zone.id, 'irrigate');
                if (zone.type === 'livestock') onZoneAction(zone.id, 'feed');
              },
            }}
          >
            <Popup>
              <span>{zone.label} ({zone.status})</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default FarmMap;
