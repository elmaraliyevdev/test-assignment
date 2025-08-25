import React from 'react';
import { Link } from 'react-router-dom';

interface FeatureCardProps {
  href: string;
  title: string;
  description: string;
  icon: string;
  variant: 'primary' | 'secondary';
}

const VARIANT_STYLES = {
  primary: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    hover: 'hover:bg-green-100',
    title: 'text-green-800',
    description: 'text-green-600',
  },
  secondary: {
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    hover: 'hover:bg-purple-100',
    title: 'text-purple-800',
    description: 'text-purple-600',
  },
} as const;

export const FeatureCard: React.FC<FeatureCardProps> = ({
  href,
  title,
  description,
  icon,
  variant,
}) => {
  const styles = VARIANT_STYLES[variant];
  
  const cardClasses = `
    block p-6 border rounded-lg transition-all duration-200 
    hover:shadow-md hover:scale-105 group
    ${styles.bg} ${styles.border} ${styles.hover}
  `.trim();

  return (
    <Link to={href} className={cardClasses}>
      <div className="text-center">
        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-200">
          {icon}
        </div>
        <h3 className={`text-xl font-bold mb-3 ${styles.title}`}>
          {title}
        </h3>
        <p className={`text-sm leading-relaxed ${styles.description}`}>
          {description}
        </p>
      </div>
    </Link>
  );
};