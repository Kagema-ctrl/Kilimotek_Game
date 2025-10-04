import React from 'react';
import './FeedbackPanel.css';

interface FeedbackPanelProps {
  message: string;
}

const FeedbackPanel: React.FC<FeedbackPanelProps> = ({ message }) => (
  <div className="feedback-panel">
    <h4>Feedback</h4>
    <p>{message}</p>
  </div>
);

export default FeedbackPanel;
