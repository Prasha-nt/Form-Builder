import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { SunMoon, Moon, Menu, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white dark:bg-surface-800 shadow-sm backdrop-blur-sm bg-opacity-80 dark:bg-opacity-80 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <SunMoon className="h-8 w-8 text-primary-600 dark:text-primary-400" />
              <span className="ml-2 text-xl font-semibold text-surface-800 dark:text-white">
                Form Builder
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="flex space-x-4">
              <NavLink href="/" isActive={location.pathname === '/'}>
                Dashboard
              </NavLink>
            </div>
          </div>

          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-surface-500 hover:text-surface-700 dark:text-surface-300 dark:hover:text-white transition-colors duration-200"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <SunMoon className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {/* Mobile menu button */}
            <div className="sm:hidden ml-3">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-surface-500 hover:text-surface-700 dark:text-surface-300 dark:hover:text-white focus:outline-none"
                aria-expanded={isMenuOpen ? 'true' : 'false'}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1">
          <MobileNavLink
            href="/"
            isActive={location.pathname === '/'}
            onClick={() => setIsMenuOpen(false)}
          >
            Dashboard
          </MobileNavLink>
        </div>
      </div>
    </nav>
  );
};

interface NavLinkProps {
  href: string;
  isActive?: boolean;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, isActive, children }) => {
  return (
    <Link
      to={href}
      className={cn(
        'px-3 py-2 rounded-md text-sm font-medium transition-colors',
        isActive
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
          : 'text-surface-600 hover:bg-primary-50 dark:text-surface-300 dark:hover:bg-primary-900/50'
      )}
    >
      {children}
    </Link>
  );
};

interface MobileNavLinkProps extends NavLinkProps {
  onClick?: () => void;
}

const MobileNavLink: React.FC<MobileNavLinkProps> = ({ href, isActive, children, onClick }) => {
  return (
    <Link
      to={href}
      className={cn(
        'block px-3 py-2 rounded-md text-base font-medium',
        isActive
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
          : 'text-surface-600 hover:bg-primary-50 dark:text-surface-300 dark:hover:bg-primary-900/50'
      )}
      onClick={onClick}
    >
      {children}
    </Link>
  );
};

export default Navbar;