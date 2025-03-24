import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { OnboardlyContextType, OnboardlyProps, OnboardlyStep, TooltipPosition } from './types';
import { getDefaultLabels, getDefaultOptions } from './utils';

// Create the context with a default value
const OnboardlyContext = createContext<OnboardlyContextType | undefined>(undefined);

// Provider component
export const OnboardlyProvider: React.FC<React.PropsWithChildren<OnboardlyProps>> = ({
  children,
  steps,
  isActive,
  onStart,
  onEnd,
  currentStep: controlledCurrentStep,
  onStepChange,
  classNames,
  labels,
  options,
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
  
  // Get default values
  const mergedOptions = getDefaultOptions(options);
  const mergedLabels = getDefaultLabels(labels);
  
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
    if (elements.length > 0 && mergedOptions.scrollIntoViewOptions !== undefined) {
      elements[0].scrollIntoView(mergedOptions.scrollIntoViewOptions || { behavior: 'smooth', block: 'center' });
    }
    
    calculateTooltipPosition();
  }, [currentStepIndex, steps, calculateTooltipPosition, mergedOptions.scrollIntoViewOptions]);
  
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
    if (mergedOptions.disableKeyboardNavigation) return;
    
    switch (e.key) {
      case 'ArrowRight':
      case 'Enter':
        handleNext();
        break;
      case 'ArrowLeft':
        handleBack();
        break;
      case 'Escape':
        if (mergedOptions.exitOnEscape !== false) {
          handleSkip();
        }
        break;
    }
  }, [handleNext, handleBack, handleSkip, mergedOptions]);
  
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
      if (!mergedOptions.disableKeyboardNavigation) {
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
    mergedOptions.disableKeyboardNavigation,
    findTargetElements,
    calculateTooltipPosition
  ]);
  
  const contextValue: OnboardlyContextType = {
    currentStepIndex,
    steps,
    isVisible,
    targetElements: targetElementsRef.current,
    tooltipPosition,
    options: mergedOptions,
    labels: mergedLabels,
    classNames,
    changeStep,
    handleNext,
    handleBack,
    handleSkip
  };
  
  return (
    <OnboardlyContext.Provider value={contextValue}>
      {children}
    </OnboardlyContext.Provider>
  );
};

// Custom hook to use the Onboardly context
export const useOnboardly = (): OnboardlyContextType => {
  const context = useContext(OnboardlyContext);
  if (context === undefined) {
    throw new Error('useOnboardly must be used within an OnboardlyProvider');
  }
  return context;
}; 