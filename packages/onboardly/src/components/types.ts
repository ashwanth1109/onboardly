import React from 'react';

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

export interface TooltipPosition {
  top: number;
  left: number;
}

export interface SpotlightOverlayProps {
  targetElements: Element[];
  options: OnboardlyProps['options'];
  onClick: () => void;
  customStyles?: React.CSSProperties;
}

export interface TooltipProps {
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
}

export interface PulsatingBorderProps {
  targetElements: Element[];
  options: OnboardlyProps['options'];
  customStyles?: React.CSSProperties;
  className?: string;
}

// Define merged options type that allows for optional properties
export interface MergedOptions {
  spotlightPadding: number;
  maskColor: string;
  maskOpacity: number;
  animationDuration: number;
  highlightPulsate: boolean;
  showProgressDots: boolean;
  exitOnEscape: boolean;
  disableOverlayClose: boolean;
  disableKeyboardNavigation: boolean;
  hideBackButtonOnFirstStep: boolean;
  hideSkipButton: boolean;
  scrollIntoViewOptions?: ScrollIntoViewOptions;
}

export interface OnboardlyContextType {
  currentStepIndex: number;
  steps: OnboardlyStep[];
  isVisible: boolean;
  targetElements: Element[];
  tooltipPosition: TooltipPosition;
  options: MergedOptions;
  labels: Required<NonNullable<OnboardlyProps['labels']>>;
  classNames: OnboardlyProps['classNames'];
  changeStep: (nextStepIndex: number) => Promise<void>;
  handleNext: () => void;
  handleBack: () => void;
  handleSkip: () => void;
} 