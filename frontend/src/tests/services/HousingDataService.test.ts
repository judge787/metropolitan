import { getData, getAllData, getStartsByCensusArea, getCompletionsByCensusArea } from '../../services/HousingDataService';
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
    
          expect(global.fetch).toHaveBeenCalledWith('/api/housingStats'); // Use global.fetch in expect
          expect(data).toEqual(mockHousingData);
        });

        it('should return an empty array if fetch fails', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Fetch error')); // Use global.fetch directly
    
            const data = await getAllData();
    
            expect(global.fetch).toHaveBeenCalledWith('/api/housingStats'); // Use global.fetch in expect
            expect(data).toEqual([]);
          });

        it('should return an empty array if ok is false', async() => {
            global.fetch.mockResolvedValueOnce({
              ok: false,
              status: 404,
            });

            const data = await getAllData();

            expect(global.fetch).toHaveBeenCalledWith('/api/housingStats');
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
    
          expect(global.fetch).toHaveBeenCalledWith('/api/housingStats/id/1'); // Use global.fetch in expect
          expect(data).toEqual(mockData);
        });
    
        it('should throw an error if fetch fails', async () => {
            global.fetch.mockRejectedValueOnce(new Error('Fetch error')); // Use global.fetch directly
    
            await expect(getData(1)).rejects.toThrow('Fetch error');
          });

        it('should throw an error if ok is false', async () => {
            global.fetch.mockResolvedValueOnce({
              ok: false,
              status: 404,
            });

            await expect(getData(1)).rejects.toThrowError('HTTP error! Status: 404');
        })
      });

      describe('getStartsByCensusArea', () => {
        it('should fetch a single housing data', async () => {
          global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockHousingData[0],
          });

          const data = await getStartsByCensusArea("Example Area 1");

          expect(global.fetch).toHaveBeenCalledWith('/api/housingStats/starts/Example Area 1');
          expect(data).toEqual(mockHousingData[0]);
        });

        it('should throw an error if fetch fails', async () => {
          global.fetch.mockRejectedValueOnce(new Error('Fetch error'));

          await expect(getStartsByCensusArea("Example Area 1")).rejects.toThrowError('Fetch error');
        });

        it('should throw an error if ok is false', async () => {
          global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
          });

          await expect(getStartsByCensusArea("Example Area 1")).rejects.toThrowError("HTTP error! Status: 404");
        })
      });

      describe('getCompletionsByCensusArea', () => {
        it('should fetch a single housing data', async () => {
          global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockHousingData[0],
          });

          const data = await getCompletionsByCensusArea("Example Area 1");

          expect(global.fetch).toHaveBeenCalledWith('/api/housingStats/completions/Example Area 1');
          expect(data).toEqual(mockHousingData[0]);
        });
        
        it('should throw an error if fetch fails', async () => {
          global.fetch.mockRejectedValueOnce(new Error('Fetch error'));

          await expect(getCompletionsByCensusArea("Example Area 1")).rejects.toThrowError("Fetch error");
        });

        it('should throw an error if ok is false', async () => {
          global.fetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
          });

          await expect(getCompletionsByCensusArea("Example Area 1")).rejects.toThrowError("HTTP error! Status: 404");
        });
      });
});