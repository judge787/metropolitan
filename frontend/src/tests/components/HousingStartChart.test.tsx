import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // For additional matchers
import HousingStartChart from '../../components/HousingStartChart';
import { getStartsByCensusArea } from '../../services/HousingDataService'; // Updated import

// Mock the getStartsByCensusArea function
vi.mock('../../services/HousingDataService');

describe('HousingStartChart Component', () => {
    beforeEach(() => {
        vi.clearAllMocks(); // Clear any previous mock calls
    });

    it('displays loading message while data is being fetched', () => {
        (getStartsByCensusArea as vi.Mock).mockImplementation(() => new Promise(() => {})); // Mock a pending promise
        render(<HousingStartChart />);
        expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
    });

    it('displays error message when data fetch fails', async () => {
        (getStartsByCensusArea as vi.Mock)
            .mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch data for Toronto')))
            .mockImplementationOnce(() => Promise.reject(new Error('Failed to fetch data for Hamilton')));

        render(<HousingStartChart />);
        
        await waitFor(() => {
            expect(screen.getByText(/Partial data: Toronto: Failed to fetch data for Toronto; Hamilton: Failed to fetch data for Hamilton/i)).toBeInTheDocument();
        });
    });
});
