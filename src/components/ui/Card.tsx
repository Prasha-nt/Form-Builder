import React from 'react';
import { cn } from '../../utils/cn';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        "bg-white dark:bg-surface-800 rounded-xl shadow-soft border border-surface-200 dark:border-surface-700 overflow-hidden transition-all duration-200",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Card;