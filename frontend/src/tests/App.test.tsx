import React from 'react';
import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from '../App';

// Mock react-router-dom completely
vi.mock('react-router-dom', () => ({
  BrowserRouter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Routes: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Route: ({ element }: { element: React.ReactNode }) => <div>{element}</div>,
  Link: ({ children }: { children: React.ReactNode }) => <a href="#">{children}</a>
}));

// Mock components used in App.tsx to avoid loading dependencies
vi.mock('../components/ProductPitch', () => ({
  default: () => <div data-testid="product-pitch">ProductPitch Mock</div>
}));

vi.mock('../components/DoubleBarChart', () => ({
  default: () => <div data-testid="double-bar-chart">DoubleBarChart Mock</div>
}));

vi.mock('../components/DoubleRadarChart', () => ({
  default: () => <div data-testid="double-radar-chart">DoubleRadarChart Mock</div>
}));

vi.mock('../components/LineChartEmployment', () => ({
  default: () => <div data-testid="line-chart">LineChart Mock</div>
}));

vi.mock('../components/LabourForceStats', () => ({
  default: () => <div data-testid="labour-stats">LabourForceStats Mock</div>
}));

vi.mock('../components/DateTime', () => ({
  default: () => <div data-testid="date-time">DateTime Mock</div>
}));

describe('App Component', () => {
  test('renders without errors', () => {
    // This should not throw an error
    render(<App />);
    expect(true).toBeTruthy();
  });
});
