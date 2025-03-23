import { describe, it, expect, vi, beforeEach } from 'vitest';
import { StrictMode } from 'react';
import App from '../App';

// Mock createRoot from react-dom/client
vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => ({
    render: vi.fn(),
  })),
}));

// Import the mocked module
import { createRoot } from 'react-dom/client';

describe('Main entry point', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock document.getElementById
    document.getElementById = vi.fn().mockReturnValue({});
  });
  
  it('renders App component inside StrictMode', async () => {
    // Directly execute the code in main.tsx rather than importing
    // This is more straightforward than trying to import dynamically
    const mainModule = await import('../main');
    
    // Since main.tsx gets executed immediately when imported, 
    // our mocks should have been called by now
    
    // Verify getElementById was called with 'root'
    expect(document.getElementById).toHaveBeenCalledWith('root');
    
    // Verify createRoot was called with the element
    expect(createRoot).toHaveBeenCalled();
    
    // Get the render function
    const renderMock = vi.mocked(createRoot).mock.results[0].value.render;
    
    // Verify render was called with App wrapped in StrictMode
    expect(renderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        type: StrictMode,
        props: expect.objectContaining({
          children: expect.objectContaining({
            type: App
          })
        })
      })
    );
  });
});
