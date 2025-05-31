import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'default',
  size = 'default',
  icon,
  iconPosition = 'left',
  isLoading = false,
  children,
  ...props
}) => {
  const variants = {
    default: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 dark:bg-primary-700 dark:hover:bg-primary-600',
    outline: 'border border-surface-300 text-surface-700 hover:bg-surface-50 focus:ring-primary-500 dark:border-surface-600 dark:text-surface-300 dark:hover:bg-surface-800',
    ghost: 'text-surface-700 hover:bg-surface-100 focus:ring-primary-500 dark:text-surface-300 dark:hover:bg-surface-800',
    destructive: 'bg-error-600 text-white hover:bg-error-700 focus:ring-error-500 dark:bg-error-700 dark:hover:bg-error-600',
  };

  const sizes = {
    default: 'px-4 py-2 text-sm',
    sm: 'px-3 py-1.5 text-xs',
    lg: 'px-6 py-3 text-base',
    icon: 'p-2',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg shadow-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
          <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : icon && iconPosition === 'left' && children ? (
        <span className="mr-2">{icon}</span>
      ) : icon && !children ? (
        icon
      ) : null}
      
      {children}
      
      {icon && iconPosition === 'right' && children && (
        <span className="ml-2">{icon}</span>
      )}
    </button>
  );
};

export default Button;