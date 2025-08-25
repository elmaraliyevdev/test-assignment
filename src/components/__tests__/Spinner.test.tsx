import React from 'react';
import { render, screen } from '@testing-library/react';
import { Spinner } from '../Spinner';

describe('Spinner', () => {
  it('should render with default size (md)', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass('w-6', 'h-6');
    
    const srText = screen.getByText('Loading...');
    expect(srText).toHaveClass('sr-only');
  });

  it('should render with small size', () => {
    render(<Spinner size="sm" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-4', 'h-4');
  });

  it('should render with large size', () => {
    render(<Spinner size="lg" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-8', 'h-8');
  });

  it('should apply custom className', () => {
    render(<Spinner className="text-blue-500" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('text-blue-500');
  });

  it('should have animation classes', () => {
    render(<Spinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('animate-spin', 'rounded-full', 'border-2');
  });

  it('should combine size and custom className', () => {
    render(<Spinner size="lg" className="text-red-500 opacity-50" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('w-8', 'h-8', 'text-red-500', 'opacity-50');
  });
});