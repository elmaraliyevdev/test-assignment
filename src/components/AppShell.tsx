import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface AppShellProps {
  children: React.ReactNode;
  pageTitle: string;
}

const NAV_ITEMS = [
  { path: '/', label: 'Home', color: 'blue' },
  { path: '/form', label: 'Submit', color: 'green' },
  { path: '/history', label: 'History', color: 'purple' },
] as const;

export const AppShell: React.FC<AppShellProps> = ({ children, pageTitle }) => {
  const location = useLocation();
  
  const getNavItemClasses = (itemPath: string, color: string) => {
    const isActive = location.pathname === itemPath;
    const baseClasses = 'px-6 py-2 rounded-md font-medium transition-all duration-200';
    
    if (isActive) {
      return `${baseClasses} bg-${color}-600 text-white shadow-md`;
    }
    
    return `${baseClasses} bg-${color}-500 text-white hover:bg-${color}-600 hover:shadow-md`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto max-w-4xl py-8 px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <header className="bg-gray-50 border-b border-gray-200 p-6">
            <h1 className="text-3xl font-bold text-gray-900 text-center mb-6">
              {pageTitle}
            </h1>
            
            <nav className="flex justify-center gap-3">
              {NAV_ITEMS.map(({ path, label, color }) => (
                <Link
                  key={path}
                  to={path}
                  className={getNavItemClasses(path, color)}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </header>
          
          {/* Main content */}
          <main className="p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};