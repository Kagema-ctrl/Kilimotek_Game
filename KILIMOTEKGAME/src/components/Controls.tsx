import React from 'react';
import './Controls.css';

interface ControlsProps {
  selectedZone: string | null;
  onAction: (action: 'irrigate' | 'fertilize' | 'feed') => void;
}

const Controls: React.FC<ControlsProps> = ({ selectedZone, onAction }) => {
  if (!selectedZone) return <div className="controls">Select a zone to manage.</div>;
  return (
    <div className="controls">
      <button onClick={() => onAction('irrigate')}>Irrigate</button>
      <button onClick={() => onAction('fertilize')}>Fertilize</button>
      <button onClick={() => onAction('feed')}>Feed Livestock</button>
    </div>
  );
};

export default Controls;
