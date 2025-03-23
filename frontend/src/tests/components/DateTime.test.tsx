import { render, screen, act } from '@testing-library/react';
import { describe, test, beforeEach, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import DateTime from '../../components/DateTime';

describe('DateTime Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-02-14T12:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders with light mode', () => {
    render(<DateTime darkMode={false} />);
    const timeElement = screen.getByText('12:00:00 PM');
    const dateElement = screen.getByText('2/14/2024');
    
    expect(timeElement).toBeInTheDocument();
    expect(dateElement).toBeInTheDocument();
    expect(timeElement).toHaveClass('text-[#2b9bda]');
    expect(dateElement).toHaveClass('text-[#2b9bda]');
  });

  test('renders with dark mode', () => {
    render(<DateTime darkMode={true} />);
    const timeElement = screen.getByText('12:00:00 PM');
    const dateElement = screen.getByText('2/14/2024');
    
    expect(timeElement).toBeInTheDocument();
    expect(dateElement).toBeInTheDocument();
    expect(timeElement).toHaveClass('text-white');
    expect(dateElement).toHaveClass('text-white');
  });

  test('updates time every second', async () => {
    render(<DateTime darkMode={false} />);
    
    // Initial time
    expect(screen.getByText('12:00:00 PM')).toBeInTheDocument();
    
    // Advance time by 1 second and update component
    await act(async () => {
      vi.advanceTimersByTime(1000);
    });

    // Need to wait for the next state update
    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText('12:00:01 PM')).toBeInTheDocument();
  });
});
