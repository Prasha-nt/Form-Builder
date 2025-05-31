import React from 'react';
import Navbar from './Navbar';
import { useTheme } from '../../context/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300`}>
      <Navbar />
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;