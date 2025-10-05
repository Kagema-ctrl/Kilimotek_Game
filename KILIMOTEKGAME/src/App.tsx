import { useState, useEffect } from 'react';
import type { Zone } from './components/FarmMap';
import FarmMap from './components/FarmMap';
import Dashboard from './components/Dashboard';
import FeedbackPanel from './components/FeedbackPanel';
import Controls from './components/Controls';
import './App.css';

const initialZones: Zone[] = [
  { id: 'zone1', type: 'crop', label: 'Crop Field 1', status: 'normal' },
  { id: 'zone2', type: 'crop', label: 'Crop Field 2', status: 'normal' },
  { id: 'zone3', type: 'livestock', label: 'Livestock Pen', status: 'normal' },
];

const initialIndicators = {
  soilMoisture: 40,
  rainfall: 10,
  ndvi: 0.5,
  livestockHealth: 70,
};

type NasaData = { ndvi: number; precipitation: number };
async function fetchNasaData(lat: number, lon: number, start: string, end: string): Promise<NasaData> {
  // Only request precipitation (PRECTOT)
  const url = `https://power.larc.nasa.gov/api/temporal/daily/point?parameters=PRECTOT&community=AG&longitude=${lon}&latitude=${lat}&start=${start}&end=${end}&format=JSON`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('NASA API error');
  const data = await res.json();
  const prectotObj = data?.properties?.parameter?.PRECTOT;
  if (!prectotObj) throw new Error('NASA data missing');
  const firstDate = Object.keys(prectotObj)[0];
  return {
    ndvi: 0.5, // fallback static NDVI for MVP
    precipitation: prectotObj[firstDate],
  };
}

function App() {
  const [zones, setZones] = useState<Zone[]>(initialZones);
  const [indicators, setIndicators] = useState(initialIndicators);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [feedback, setFeedback] = useState('Welcome to Kilimotek! Select a zone and take an action.');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchNasaData(-0.6167, 37.3833, '20240101', '20240110')
      .then((result) => {
        setIndicators((prev) => ({
          ...prev,
          ndvi: result.ndvi,
          rainfall: result.precipitation,
        }));
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch NASA precipitation data. Using fallback values.');
        setIndicators((prev) => ({
          ...prev,
          ndvi: 0.5,
          rainfall: 10,
        }));
        setLoading(false);
      });
  }, []);

  const handleZoneAction = (zoneId: string, action: 'irrigate' | 'fertilize' | 'feed') => {
    setSelectedZone(zoneId);
    setZones((prev) => prev.map(z => z.id === zoneId ? { ...z, status: action === 'feed' ? 'fed' : action === 'irrigate' ? 'irrigated' : 'fertilized' } : z));
    let newIndicators = { ...indicators };
    let msg = '';
    if (action === 'irrigate') {
      newIndicators.soilMoisture = Math.min(100, indicators.soilMoisture + 20);
      newIndicators.ndvi = Math.min(1, indicators.ndvi + 0.1);
      msg = indicators.soilMoisture > 70 ? 'Too much irrigation! Soil moisture is high (simulated from SMAP).' : 'Irrigation successful. Crop health improved (NDVI up).';
    } else if (action === 'fertilize') {
      newIndicators.ndvi = Math.min(1, indicators.ndvi + 0.15);
      msg = 'Fertilizer applied. NDVI (crop vigor) increased.';
    } else if (action === 'feed') {
      newIndicators.livestockHealth = Math.min(100, indicators.livestockHealth + 15);
      msg = 'Livestock fed. Health improved.';
    }
    setIndicators(newIndicators);
    setFeedback(msg);
  };

  const handleControlAction = (action: 'irrigate' | 'fertilize' | 'feed') => {
    if (selectedZone) handleZoneAction(selectedZone, action);
  };

  return (
    <div className="App">
      <h1>Kilimotek: Farming from Space</h1>
      {loading ? (
        <div>Loading NASA precipitation data…</div>
      ) : (
        <Dashboard indicators={indicators} />
      )}
      {error && (
        <div style={{ color: 'orange', marginBottom: '1rem' }}>{error}</div>
      )}
      <FarmMap
        zones={zones}
        onZoneAction={(zoneId, action) => handleZoneAction(zoneId, action)}
      />
      <Controls selectedZone={selectedZone} onAction={handleControlAction} />
      <FeedbackPanel message={feedback} />
      <div style={{marginTop: '2rem', fontSize: '0.9em', color: '#888'}}>
        <p>NASA Data: Precipitation for Mwea Tebere, Kenya (Jan 2024). NDVI is simulated for MVP.</p>
      </div>
    </div>
  );
}

export default App;
