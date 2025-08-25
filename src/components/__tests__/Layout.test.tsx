import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../Layout';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('Layout', () => {
  it('should render title and navigation links', () => {
    renderWithRouter(
      <Layout title="Test Title">
        <div>Test content</div>
      </Layout>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test content')).toBeInTheDocument();
    
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Form' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'History' })).toBeInTheDocument();
  });

  it('should have correct navigation links', () => {
    renderWithRouter(
      <Layout title="Test">
        <div>Content</div>
      </Layout>
    );

    const homeLink = screen.getByRole('link', { name: 'Home' });
    const formLink = screen.getByRole('link', { name: 'Form' });
    const historyLink = screen.getByRole('link', { name: 'History' });

    expect(homeLink).toHaveAttribute('href', '/');
    expect(formLink).toHaveAttribute('href', '/form');
    expect(historyLink).toHaveAttribute('href', '/history');
  });

  it('should render children content', () => {
    const testContent = (
      <div>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </div>
    );

    renderWithRouter(
      <Layout title="Test">{testContent}</Layout>
    );

    expect(screen.getByText('Paragraph 1')).toBeInTheDocument();
    expect(screen.getByText('Paragraph 2')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    renderWithRouter(
      <Layout title="Test">
        <div data-testid="content">Content</div>
      </Layout>
    );

    const mainElement = screen.getByRole('main');
    expect(mainElement).toBeInTheDocument();
    
    const titleElement = screen.getByText('Test');
    expect(titleElement).toHaveClass('text-3xl', 'font-bold', 'text-gray-800', 'text-center', 'mb-8');
  });
});