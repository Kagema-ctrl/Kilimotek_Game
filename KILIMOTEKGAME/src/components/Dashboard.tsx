import React from 'react';
import './Dashboard.css';

interface DashboardProps {
  indicators: {
    soilMoisture: number;
    rainfall: number;
    ndvi: number;
    livestockHealth: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ indicators }) => {
  return (
    <div className="dashboard">
      <h3>Farm Dashboard</h3>
      <div>Soil Moisture: {indicators.soilMoisture}%</div>
      <div>Rainfall: {indicators.rainfall} mm</div>
      <div>NDVI (Crop Health): {indicators.ndvi}</div>
      <div>Livestock Health: {indicators.livestockHealth}%</div>
    </div>
  );
};

export default Dashboard;
