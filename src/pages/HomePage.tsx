import React from 'react';
import { AppShell } from '../components/AppShell';
import { FeatureCard } from '../components/FeatureCard';

const FEATURES = [
  {
    href: '/form',
    title: 'Submit Information',
    description: 'Fill out a simple form with your personal details. Includes real-time validation and error handling.',
    icon: '📝',
    variant: 'primary' as const,
  },
  {
    href: '/history',
    title: 'View Submissions',
    description: 'Browse through all successful form submissions with smart sorting and submission tracking.',
    icon: '📊',
    variant: 'secondary' as const,
  },
] as const;

export const HomePage: React.FC = () => {
  return (
    <AppShell pageTitle="Welcome">
      <div className="text-center space-y-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-lg text-gray-600 leading-relaxed">
            This application demonstrates a complete form submission workflow 
            with data persistence and history tracking.
          </p>
          <p className="text-sm text-gray-500 mt-3">
            Choose an option below to get started, or use the navigation menu above.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {FEATURES.map((feature) => (
            <FeatureCard key={feature.href} {...feature} />
          ))}
        </div>
      </div>
    </AppShell>
  );
};