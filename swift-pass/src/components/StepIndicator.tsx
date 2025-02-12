import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  title: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, title }) => (
  <div className="step-indicator">
    <div className="step-header">
      <div className='step-container'>
        <h2 className="step-title">{title}</h2>
        <span className="step-number">Step {currentStep}/3</span>
      </div>
    </div>
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${(currentStep / 3) * 100}%` }} />
    </div>
  </div>
);

export default StepIndicator;
