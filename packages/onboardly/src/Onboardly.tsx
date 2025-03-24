import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

// Core step interface
export interface OnboardlyStep {
  // Target element ID or array of IDs to highlight
  target: string | string[];
  
  // Step content
  title: string;
  content: string;
  
  // Optional tooltip positioning
  position?: 'top' | 'bottom' | 'left' | 'right';
  
  // Optional callback that runs before showing this step
  // Can return a promise for async operations
  setup?: () => void | Promise<void>;
  
  // Optional callback that runs when exiting this step
  cleanup?: () => void;
  
  // Optional styles that override default styles for this step
  styles?: {
    tooltip?: React.CSSProperties;
    highlight?: React.CSSProperties;
    spotlightMask?: React.CSSProperties;
  };
}

// Main component props
export interface OnboardlyProps {
  // Array of tour steps
  steps: OnboardlyStep[];
  
  // Control whether the tour is running
  isActive: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  
  // Current step controls (controlled component mode)
  currentStep?: number;
  onStepChange?: (newStep: number) => void;
  
  // Visual customization
  classNames?: {
    tooltip?: string;
    tooltipTitle?: string;
    tooltipContent?: string;
    navigationContainer?: string;
    navigationDots?: string;
    backButton?: string;
    nextButton?: string;
    skipButton?: string;
    spotlightMask?: string;
    highlightBorder?: string;
  };
  
  // Labels customization
  labels?: {
    nextButton?: string;
    backButton?: string;
    skipButton?: string;
    finishButton?: string;
  };
  
  // Behavior options
  options?: {
    spotlightPadding?: number;
    scrollIntoViewOptions?: ScrollIntoViewOptions;
    disableOverlayClose?: boolean;
    disableKeyboardNavigation?: boolean;
    hideBackButtonOnFirstStep?: boolean;
    hideSkipButton?: boolean;
    showProgressDots?: boolean;
    highlightPulsate?: boolean;
    exitOnEscape?: boolean;
    animationDuration?: number;
    maskColor?: string;
    maskOpacity?: number;
  };
  
  // Event hooks
  onBeforeStepChange?: (fromStep: number, toStep: number) => boolean | Promise<boolean>;
  onAfterStepChange?: (currentStep: number) => void;
}

interface TooltipPosition {
  top: number;
  left: number;
}

// SpotlightOverlay component
const SpotlightOverlay: React.FC<{
  targetElements: Element[];
  options: OnboardlyProps['options'];
  onClick: () => void;
  customStyles?: React.CSSProperties;
}> = ({ targetElements, options, onClick, customStyles }) => {
  const defaultOptions = {
    spotlightPadding: 10,
    maskColor: '#000',
    maskOpacity: 0.7,
    animationDuration: 300,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const getSpotlightStyles = () => {
    if (targetElements.length === 0) return null;
    
    // Calculate the bounding box that encompasses all target elements
    const rects = targetElements.map(el => el.getBoundingClientRect());
    
    let minX = Math.min(...rects.map(r => r.left));
    let minY = Math.min(...rects.map(r => r.top));
    let maxX = Math.max(...rects.map(r => r.right));
    let maxY = Math.max(...rects.map(r => r.bottom));
    
    // Apply padding
    const padding = mergedOptions.spotlightPadding || 0;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    return {
      position: 'fixed',
      top: `${minY}px`,
      left: `${minX}px`,
      width: `${maxX - minX}px`,
      height: `${maxY - minY}px`,
      boxShadow: `0 0 0 9999px rgba(${
        mergedOptions.maskColor === '#000' ? '0, 0, 0' : '255, 255, 255'
      }, ${mergedOptions.maskOpacity})`,
      borderRadius: '4px',
      transition: `all ${mergedOptions.animationDuration}ms ease-in-out`,
      ...customStyles,
    } as React.CSSProperties;
  };
  
  const spotlightStyles = getSpotlightStyles();
  
  if (!spotlightStyles) return null;
  
  return (
    <div
      onClick={onClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9998,
        pointerEvents: 'all',
      }}
    >
      <div
        style={spotlightStyles}
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
};

// Tooltip component
const Tooltip: React.FC<{
  step: OnboardlyStep;
  position: TooltipPosition;
  isFirstStep: boolean;
  isLastStep: boolean;
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
  totalSteps: number;
  currentStepIndex: number;
  options: OnboardlyProps['options'];
  labels: Required<NonNullable<OnboardlyProps['labels']>>;
  classNames: OnboardlyProps['classNames'];
}> = ({
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

// Pulsating Border component
const PulsatingBorder: React.FC<{
  targetElements: Element[];
  options: OnboardlyProps['options'];
  customStyles?: React.CSSProperties;
  className?: string;
}> = ({ targetElements, options, customStyles, className }) => {
  const defaultOptions = {
    spotlightPadding: 10,
    animationDuration: 300,
  };
  
  const mergedOptions = { ...defaultOptions, ...options };
  
  const getBorderStyles = () => {
    if (targetElements.length === 0) return null;
    
    // Calculate the bounding box that encompasses all target elements
    const rects = targetElements.map(el => el.getBoundingClientRect());
    
    let minX = Math.min(...rects.map(r => r.left));
    let minY = Math.min(...rects.map(r => r.top));
    let maxX = Math.max(...rects.map(r => r.right));
    let maxY = Math.max(...rects.map(r => r.bottom));
    
    // Apply padding
    const padding = mergedOptions.spotlightPadding || 0;
    minX -= padding;
    minY -= padding;
    maxX += padding;
    maxY += padding;
    
    return {
      position: 'fixed',
      top: `${minY}px`,
      left: `${minX}px`,
      width: `${maxX - minX}px`,
      height: `${maxY - minY}px`,
      border: '2px solid #4A90E2',
      borderRadius: '4px',
      pointerEvents: 'none',
      transition: `all ${mergedOptions.animationDuration}ms ease-in-out`,
      animation: options?.highlightPulsate ? 'onboardly-pulse 1.5s infinite' : 'none',
      ...customStyles,
    } as React.CSSProperties;
  };
  
  const borderStyles = getBorderStyles();
  
  if (!borderStyles) return null;
  
  return (
    <div 
      style={borderStyles}
      className={className}
    />
  );
};

// Main Onboardly component
export const Onboardly: React.FC<OnboardlyProps> = ({
  steps,
  isActive,
  onStart,
  onEnd,
  currentStep: controlledCurrentStep,
  onStepChange,
  classNames,
  labels = {},
  options = {},
  onBeforeStepChange,
  onAfterStepChange,
}) => {
  const [internalCurrentStep, setInternalCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition>({ top: 0, left: 0 });
  
  // Determine if we're in controlled or uncontrolled mode
  const isControlled = controlledCurrentStep !== undefined;
  const currentStepIndex = isControlled ? controlledCurrentStep : internalCurrentStep;
  
  // Refs
  const targetElementsRef = useRef<Element[]>([]);
  
  // Default values for labels
  const defaultLabels = {
    nextButton: 'Next',
    backButton: 'Back',
    skipButton: 'Skip',
    finishButton: 'Finish'
  };
  
  const mergedLabels = { ...defaultLabels, ...labels };
  
  // Calculate tooltip position based on target elements
  const calculateTooltipPosition = useCallback(() => {
    if (targetElementsRef.current.length === 0) return;
    
    const rects = targetElementsRef.current.map(el => el.getBoundingClientRect());
    
    // Calculate the center point of all target elements
    const centerX = rects.reduce((sum, rect) => sum + (rect.left + rect.width / 2), 0) / rects.length;
    const centerY = rects.reduce((sum, rect) => sum + (rect.top + rect.height / 2), 0) / rects.length;
    
    // Position based on the step's position property
    const position = steps[currentStepIndex].position || 'bottom';
    const rect = rects[0]; // Use the first element for positioning logic
    
    let top = centerY;
    let left = centerX;
    
    switch (position) {
      case 'top':
        top = rect.top - 10;
        left = centerX - 150; // Assuming tooltip width is 300px
        break;
      case 'bottom':
        top = rect.bottom + 10;
        left = centerX - 150;
        break;
      case 'left':
        top = centerY - 100; // Assuming some tooltip height
        left = rect.left - 310; // tooltip width + margin
        break;
      case 'right':
        top = centerY - 100;
        left = rect.right + 10;
        break;
    }
    
    setTooltipPosition({ top, left });
  }, [currentStepIndex, steps]);
  
  // Find target elements by ID
  const findTargetElements = useCallback(() => {
    const currentStep = steps[currentStepIndex];
    const targetIds = Array.isArray(currentStep.target) 
      ? currentStep.target 
      : [currentStep.target];
    
    const elements = targetIds
      .map(id => document.getElementById(id))
      .filter(el => el !== null) as Element[];
    
    targetElementsRef.current = elements;
    
    // Scroll into view if needed
    if (elements.length > 0 && options.scrollIntoViewOptions !== undefined) {
      elements[0].scrollIntoView(options.scrollIntoViewOptions || { behavior: 'smooth', block: 'center' });
    }
    
    calculateTooltipPosition();
  }, [currentStepIndex, steps, calculateTooltipPosition, options.scrollIntoViewOptions]);
  
  // Handle step change
  const changeStep = useCallback(async (nextStepIndex: number) => {
    const currentStep = steps[currentStepIndex];
    
    // Execute cleanup function if available
    if (currentStep && currentStep.cleanup) {
      currentStep.cleanup();
    }
    
    // Execute before step change hook if available
    if (onBeforeStepChange) {
      const shouldProceed = await onBeforeStepChange(currentStepIndex, nextStepIndex);
      if (!shouldProceed) return;
    }
    
    // Update step
    if (isControlled) {
      onStepChange?.(nextStepIndex);
    } else {
      setInternalCurrentStep(nextStepIndex);
    }
    
    // Execute after step change hook if available
    if (onAfterStepChange) {
      onAfterStepChange(nextStepIndex);
    }
  }, [currentStepIndex, steps, onBeforeStepChange, isControlled, onStepChange, onAfterStepChange]);
  
  // Navigation handlers
  const handleNext = useCallback(() => {
    const nextStep = currentStepIndex + 1;
    
    if (nextStep < steps.length) {
      changeStep(nextStep);
    } else {
      // End tour
      setIsVisible(false);
      onEnd?.();
    }
  }, [currentStepIndex, steps, changeStep, onEnd]);
  
  const handleBack = useCallback(() => {
    if (currentStepIndex > 0) {
      changeStep(currentStepIndex - 1);
    }
  }, [currentStepIndex, changeStep]);
  
  const handleSkip = useCallback(() => {
    setIsVisible(false);
    onEnd?.();
  }, [onEnd]);
  
  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (options.disableKeyboardNavigation) return;
    
    switch (e.key) {
      case 'ArrowRight':
      case 'Enter':
        handleNext();
        break;
      case 'ArrowLeft':
        handleBack();
        break;
      case 'Escape':
        if (options.exitOnEscape !== false) {
          handleSkip();
        }
        break;
    }
  }, [handleNext, handleBack, handleSkip, options]);
  
  // Execute setup function for the current step
  const executeStepSetup = useCallback(async () => {
    const currentStep = steps[currentStepIndex];
    
    if (currentStep && currentStep.setup) {
      await Promise.resolve(currentStep.setup());
    }
    
    findTargetElements();
  }, [currentStepIndex, steps, findTargetElements]);
  
  // Initialize tour
  useEffect(() => {
    if (isActive && steps.length > 0) {
      setIsVisible(true);
      onStart?.();
      
      // Reset to first step if not controlled
      if (!isControlled) {
        setInternalCurrentStep(0);
      }
    } else {
      setIsVisible(false);
    }
  }, [isActive, steps, onStart, isControlled]);
  
  // Handle step changes
  useEffect(() => {
    if (isVisible) {
      executeStepSetup();
      
      // Add event listeners
      if (!options.disableKeyboardNavigation) {
        window.addEventListener('keydown', handleKeyDown);
      }
      
      const handleResize = () => {
        findTargetElements();
        calculateTooltipPosition();
      };
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      
      // Cleanup
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [
    isVisible, 
    currentStepIndex, 
    executeStepSetup, 
    handleKeyDown, 
    options.disableKeyboardNavigation,
    findTargetElements,
    calculateTooltipPosition
  ]);
  
  // Don't render anything if not active
  if (!isVisible || !isActive) return null;
  
  // Create Portal for the overlay and tooltip
  return ReactDOM.createPortal(
    <>
      <style>
        {`
          @keyframes onboardly-pulse {
            0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(74, 144, 226, 0); }
            100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
          }
        `}
      </style>
      <SpotlightOverlay
        targetElements={targetElementsRef.current}
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
          targetElements={targetElementsRef.current}
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
        labels={mergedLabels}
        classNames={classNames}
      />
    </>,
    document.body
  );
}; 