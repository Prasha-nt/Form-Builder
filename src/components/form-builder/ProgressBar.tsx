import React from 'react';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  steps: number;
  currentStep: number;
  onStepChange: (step: number) => void;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
  onStepChange,
}) => {
  return (
    <div className="flex items-center space-x-2">
      {Array.from({ length: steps }).map((_, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <div className={cn(
              "h-1 w-6 rounded-full",
              index <= currentStep
                ? "bg-primary-500 dark:bg-primary-400"
                : "bg-surface-300 dark:bg-surface-600"
            )} />
          )}
          <button
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm transition-colors",
              index === currentStep
                ? "bg-primary-500 text-white dark:bg-primary-600"
                : index < currentStep
                ? "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
                : "bg-surface-200 text-surface-700 dark:bg-surface-700 dark:text-surface-400"
            )}
            onClick={() => onStepChange(index)}
          >
            {index + 1}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};