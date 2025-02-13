import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Import jest-dom for additional matchers
import ProductPitch from '../../components/ProductPitch';

describe('ProductPitch Component', () => {
  it('renders the "About Us" heading', () => {
    render(<ProductPitch />);
    const heading = screen.getByRole('heading', { name: /About Us/i });
    expect(heading).toBeVisible(); // Use toBeVisible() from jest-dom
  });

  it('renders the main description text', () => {
    render(<ProductPitch />);
    const description = screen.getByText(/What if you could easily track how housing and employment growth/i);
    expect(description).toBeVisible(); // Use toBeVisible() from jest-dom
  });
});
