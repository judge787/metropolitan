import { getData, getAllData } from '../../services/HousingDataService';
import { HousingData } from '../../types/HousingData';
import { describe, it, expect, vi, afterEach, beforeAll, afterAll } from 'vitest'; // Import vitest functions

// Mocking global fetch function for all tests
global.fetch = vi.fn(); // Use vi.fn() for vitest mocks

const mockHousingData: HousingData[] = [
  { id: 1, censusArea: "Example Area 1", totalStarts: 10, totalComplete: 5 },
  { id: 2, censusArea: "Example Area 2", totalStarts: 20, totalComplete: 10 },
  { id: 3, censusArea: "Example Area 3", totalStarts: 30, totalComplete: 15 },
];

beforeAll(() => {
    vi.spyOn(console, 'log').mockImplementation(() => { }); // Suppress console.log
    vi.spyOn(console, 'error').mockImplementation(() => { }); // Suppress console.error
});

// Restore original console methods after all tests
afterAll(() => {
    (console.log as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
});

describe('housingService', () => {
    afterEach(() => {
        vi.clearAllMocks(); // Clear mocks after each test using vi.clearAllMocks()
    });

    describe('getAllData', () => {
        it('should fetch all housing data', async () => {
          global.fetch.mockResolvedValueOnce({ // Use global.fetch directly
            ok: true,
            json: async () => mockHousingData,
          });
    
          const data = await getAllData();
    
          expect(global.fetch).toHaveBeenCalledWith('/api/data/all'); // Use global.fetch in expect
          expect(data).toEqual(mockHousingData);
        });

        it('should return an empty array if fetch fails', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Fetch error')); // Use global.fetch directly
    
            const data = await getAllData();
    
            expect(global.fetch).toHaveBeenCalledWith('/api/data/all'); // Use global.fetch in expect
            expect(data).toEqual([]);
          });
      });
    
      describe('getData', () => {
        it('should fetch single housing data', async () => {
          const mockData = mockHousingData[0];
          global.fetch.mockResolvedValueOnce({ // Use global.fetch directly
            ok: true,
            json: async () => mockData,
          });
    
          const data = await getData(1);
    
          expect(global.fetch).toHaveBeenCalledWith('/api/data/get/id/1'); // Use global.fetch in expect
          expect(data).toEqual(mockData);
        });
    
        it('should throw an error if fetch fails', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Fetch error')); // Use global.fetch directly
    
            await expect(getData(1)).rejects.toThrow('Fetch error');
          });
      });
});