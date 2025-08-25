import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '../HomePage';

const renderWithRouter = (component: React.ReactElement) => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

describe('HomePage', () => {
  it('should render page title and welcome message', () => {
    renderWithRouter(<HomePage />);

    expect(screen.getByText('Test Assignment Application')).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the test assignment application/)).toBeInTheDocument();
  });

  it('should render navigation links in header', () => {
    renderWithRouter(<HomePage />);

    const navLinks = screen.getAllByRole('link');
    const homeLinks = navLinks.filter(link => link.textContent === 'Home');
    const formLinks = navLinks.filter(link => link.textContent === 'Form');
    const historyLinks = navLinks.filter(link => link.textContent === 'History');

    expect(homeLinks.length).toBeGreaterThan(0);
    expect(formLinks.length).toBeGreaterThan(0);
    expect(historyLinks.length).toBeGreaterThan(0);
  });

  it('should render feature cards with descriptions', () => {
    renderWithRouter(<HomePage />);

    expect(screen.getByText('Form Page')).toBeInTheDocument();
    expect(screen.getByText('History Page')).toBeInTheDocument();
    
    expect(screen.getByText(/Submit your information with date/)).toBeInTheDocument();
    expect(screen.getByText(/View the history of all successful submissions/)).toBeInTheDocument();
  });

  it('should have links to form and history pages in feature cards', () => {
    renderWithRouter(<HomePage />);

    const links = screen.getAllByRole('link');
    const formPageLink = links.find(link => 
      link.getAttribute('href') === '/form' && 
      link.textContent?.includes('Form Page')
    );
    const historyPageLink = links.find(link => 
      link.getAttribute('href') === '/history' && 
      link.textContent?.includes('History Page')
    );

    expect(formPageLink).toBeInTheDocument();
    expect(historyPageLink).toBeInTheDocument();
  });

  it('should display emojis for visual appeal', () => {
    renderWithRouter(<HomePage />);

    expect(screen.getByText('📝')).toBeInTheDocument();
    expect(screen.getByText('📊')).toBeInTheDocument();
  });
});