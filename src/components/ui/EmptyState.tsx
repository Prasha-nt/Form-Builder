import React from 'react';
import { cn } from '../../utils/cn';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  className,
}) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl p-8 shadow-sm",
        "flex flex-col items-center justify-center text-center animate-fade-in",
        className
      )}
    >
      {icon && <div className="text-surface-400 dark:text-surface-500 mb-4">{icon}</div>}
      <h3 className="text-lg font-medium text-surface-800 dark:text-white mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-surface-500 dark:text-surface-400 mb-6 max-w-md">
          {description}
        </p>
      )}
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;