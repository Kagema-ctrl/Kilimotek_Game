import React from 'react';
import './FarmMap.css';
// ... existing code ...'crop' | 'livestock';

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

const FarmMap: React.FC<FarmMapProps> = ({ zones, onZoneAction }) => {
  return (
    <div className="farm-map">
      {zones.map((zone) => (
        <div key={zone.id} className={`zone zone-${zone.type} zone-${zone.status}`}
          onClick={() => {
            if (zone.type === 'crop') onZoneAction(zone.id, 'irrigate');
            if (zone.type === 'livestock') onZoneAction(zone.id, 'feed');
          }}
        >
          <span>{zone.label}</span>
        </div>
      ))}
    </div>
  );
};

export default FarmMap;
