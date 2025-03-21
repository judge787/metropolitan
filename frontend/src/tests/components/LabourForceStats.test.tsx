import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LabourForceStats from '../../components/LabourForceStats';
import { vi } from 'vitest';

// Mock Chart.js to avoid canvas rendering issues
vi.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="line-chart">Line Chart Component</div>
}));

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
    getChart: vi.fn(() => ({ destroy: vi.fn() }))
  },
  CategoryScale: {},
  LinearScale: {},
  PointElement: {},
  LineElement: {},
  Title: {},
  Tooltip: {},
  Legend: {},
  Filler: {}
}));

describe('LabourForceStats Component', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const advanceTimersAndWait = async (ms: number) => {
    await vi.advanceTimersByTimeAsync(ms);
    return new Promise(resolve => setTimeout(resolve, 0));
  };

  it('displays dropdown for housing types', async () => {
    render(<LabourForceStats />);
    
    // Advance timers to resolve the 1s timeout
    await advanceTimersAndWait(1000);

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/Housing Type:/i)).toBeInTheDocument();
    });
  });

  it('displays dropdown for labor force metrics', async () => {
    render(<LabourForceStats />);
    
    await advanceTimersAndWait(1000);

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.getByLabelText(/Labor Force Metric:/i)).toBeInTheDocument();
    });
  });

  it('displays the chart after data is loaded', async () => {
    render(<LabourForceStats />);
    
    await advanceTimersAndWait(1000);

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    });
  });

  it('displays chart data summary section', async () => {
    render(<LabourForceStats />);
    
    await advanceTimersAndWait(1000);

    await waitFor(() => {
      expect(screen.queryByText(/Loading.../i)).not.toBeInTheDocument();
      expect(screen.getByText(/Data Summary/i)).toBeInTheDocument();
      expect(screen.getByText(/correlation between labor force statistics/i)).toBeInTheDocument();
    });
  });
});