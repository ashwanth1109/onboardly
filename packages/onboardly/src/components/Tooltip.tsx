import React, { useRef } from 'react';
import { TooltipProps } from './types';

export const Tooltip: React.FC<TooltipProps> = ({
  step,
  position,
  isFirstStep,
  isLastStep,
  onNext,
  onBack,
  onSkip,
  totalSteps,
  currentStepIndex,
  options,
  labels,
  classNames,
}) => {
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  const getTooltipPosition = () => {
    const pos = { ...position };
    const stepPosition = step.position || 'bottom';
    const margin = 10;
    
    // Adjust position based on tooltip size and viewport
    if (tooltipRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      
      if (stepPosition === 'top') {
        pos.top -= (tooltipRect.height + margin);
      } else if (stepPosition === 'bottom') {
        pos.top += margin;
      } else if (stepPosition === 'left') {
        pos.left -= (tooltipRect.width + margin);
      } else if (stepPosition === 'right') {
        pos.left += margin;
      }
      
      // Keep tooltip within viewport
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      if (pos.left < 0) pos.left = margin;
      if (pos.top < 0) pos.top = margin;
      if (pos.left + tooltipRect.width > viewportWidth) {
        pos.left = viewportWidth - tooltipRect.width - margin;
      }
      if (pos.top + tooltipRect.height > viewportHeight) {
        pos.top = viewportHeight - tooltipRect.height - margin;
      }
    }
    
    return {
      top: `${pos.top}px`,
      left: `${pos.left}px`,
    };
  };
  
  const tooltipStyles: React.CSSProperties = {
    position: 'fixed',
    zIndex: 9999,
    backgroundColor: 'white',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
    borderRadius: '4px',
    padding: '15px',
    width: '300px',
    transition: `all ${options?.animationDuration || 300}ms ease-in-out`,
    ...getTooltipPosition(),
    ...step.styles?.tooltip,
  };
  
  return (
    <div 
      ref={tooltipRef} 
      style={tooltipStyles} 
      className={classNames?.tooltip}
    >
      <h3 className={classNames?.tooltipTitle} style={{ margin: '0 0 10px 0' }}>{step.title}</h3>
      <div className={classNames?.tooltipContent} style={{ marginBottom: '15px' }}>{step.content}</div>
      
      <div className={classNames?.navigationContainer} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {options?.showProgressDots !== false && (
          <div className={classNames?.navigationDots} style={{ display: 'flex', gap: '5px' }}>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: i === currentStepIndex ? '#4A90E2' : '#D8D8D8',
                }}
              />
            ))}
          </div>
        )}
        
        <div style={{ display: 'flex', gap: '10px' }}>
          {!isFirstStep || !options?.hideBackButtonOnFirstStep ? (
            <button 
              onClick={onBack} 
              disabled={isFirstStep}
              className={classNames?.backButton}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #D8D8D8',
                backgroundColor: 'white',
                cursor: isFirstStep ? 'not-allowed' : 'pointer',
                opacity: isFirstStep ? 0.5 : 1,
              }}
            >
              {labels.backButton}
            </button>
          ) : null}
          
          {!options?.hideSkipButton && !isLastStep && (
            <button 
              onClick={onSkip}
              className={classNames?.skipButton}
              style={{
                padding: '8px 12px',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
              }}
            >
              {labels.skipButton}
            </button>
          )}
          
          <button 
            onClick={onNext}
            className={classNames?.nextButton}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: '#4A90E2',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            {isLastStep ? labels.finishButton : labels.nextButton}
          </button>
        </div>
      </div>
    </div>
  );
}; 