import React from 'react';
import ReactDOM from 'react-dom';
import { OnboardlyProps } from './types';
import { OnboardlyProvider, useOnboardly } from './context';
import { SpotlightOverlay } from './SpotlightOverlay';
import { PulsatingBorder } from './PulsatingBorder';
import { Tooltip } from './Tooltip';

// KeyframeStyles component to insert CSS keyframes
const KeyframeStyles: React.FC = () => (
  <style>
    {`
      @keyframes onboardly-pulse {
        0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4); }
        70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
        100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
      }
    `}
  </style>
);

// OnboardlyContent component that uses context and renders the components
const OnboardlyContent: React.FC = () => {
  const {
    steps,
    currentStepIndex,
    targetElements,
    tooltipPosition,
    options,
    labels,
    classNames,
    handleNext,
    handleBack,
    handleSkip,
    isVisible
  } = useOnboardly();
  
  if (!isVisible) return null;
  
  // Create Portal for the overlay and tooltip
  return ReactDOM.createPortal(
    <>
      <KeyframeStyles />
      <SpotlightOverlay
        targetElements={targetElements}
        options={options}
        onClick={() => {
          if (!options.disableOverlayClose) {
            handleSkip();
          }
        }}
        customStyles={steps[currentStepIndex].styles?.spotlightMask}
      />
      {options.highlightPulsate !== false && (
        <PulsatingBorder
          targetElements={targetElements}
          options={options}
          customStyles={steps[currentStepIndex].styles?.highlight}
          className={classNames?.highlightBorder}
        />
      )}
      <Tooltip
        step={steps[currentStepIndex]}
        position={tooltipPosition}
        isFirstStep={currentStepIndex === 0}
        isLastStep={currentStepIndex === steps.length - 1}
        onNext={handleNext}
        onBack={handleBack}
        onSkip={handleSkip}
        totalSteps={steps.length}
        currentStepIndex={currentStepIndex}
        options={options}
        labels={labels}
        classNames={classNames}
      />
    </>,
    document.body
  );
};

// Main Onboardly component
export const Onboardly: React.FC<OnboardlyProps> = (props) => {
  return (
    <OnboardlyProvider {...props}>
      <OnboardlyContent />
    </OnboardlyProvider>
  );
}; 