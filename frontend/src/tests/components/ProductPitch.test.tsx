import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProductPitch from '../../components/ProductPitch';

describe('ProductPitch Component', () => {
  describe('Light Mode', () => {
    beforeEach(() => {
      render(<ProductPitch darkMode={false} />);
    });

    it('renders with light mode styles', () => {
      const section = screen.getByTestId('product-pitch-section');
      expect(section).toHaveClass('bg-[#d3f3f8]');
    });

    it('renders the "About Us" heading with light mode color', () => {
      const heading = screen.getByRole('heading', { name: /About Us/i });
      expect(heading).toHaveStyle({ color: 'rgb(211, 243, 248)' });
    });

    it('renders the description with light mode color', () => {
      const description = screen.getByText(/What if you could easily track/i);
      expect(description).toHaveClass('text-[#2b9bda]');
    });
  });

  describe('Dark Mode', () => {
    beforeEach(() => {
      render(<ProductPitch darkMode={true} />);
    });

    it('renders with dark mode styles', () => {
      const section = screen.getByTestId('product-pitch-section');
      expect(section).not.toHaveClass('bg-[#d3f3f8]');
    });

    it('renders the "About Us" heading with dark mode color', () => {
      const heading = screen.getByRole('heading', { name: /About Us/i });
      expect(heading).toHaveStyle({ color: 'rgb(255, 255, 255)' });
    });

    it('renders the description with dark mode color', () => {
      const description = screen.getByText(/What if you could easily track/i);
      expect(description).toHaveClass('text-white');
    });
  });
});
