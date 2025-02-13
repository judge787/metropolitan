import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // For additional matchers
import HousingStartChart from '../../components/HousingStartChart';
import { getData } from '../../services/HousingDataService';

// Mock the getData function
vi.mock('../../services/HousingDataService');

describe('HousingStartChart Component', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Clear any previous mock calls
    });

    it('displays loading message while data is being fetched', () => {
        (getData as vi.Mock).mockImplementation(() => new Promise(() => {})); // Mock a pending promise
        render(<HousingStartChart />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('displays error message when data fetch fails', async () => {
        (getData as vi.Mock).mockImplementation(() => Promise.reject(new Error('Failed to fetch data')));
        render(<HousingStartChart />);
        
        await waitFor(() => {
            expect(screen.getByText(/Partial data: Toronto: Failed to fetch data/i)).toBeInTheDocument();
        });
    });
});
