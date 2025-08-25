import React from 'react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 text-center mb-8">
            {title}
          </h1>
          
          <nav className="flex justify-center gap-4 mb-8">
            <Link
              to="/"
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/form"
              className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              Form
            </Link>
            <Link
              to="/history"
              className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
            >
              History
            </Link>
          </nav>
          
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
};