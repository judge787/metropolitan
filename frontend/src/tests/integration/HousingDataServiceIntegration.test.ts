import { describe, it, expect } from 'vitest';
import { getAllData, getStartsByCensusArea } from '../../services/HousingDataService';


describe('Housing Data Service Integration', () => {
  it('should fetch all housing data from actual backend', async () => {
    const data = await getAllData();
    
    expect(data).toBeDefined();
    expect(Array.isArray(data)).toBe(true);
    
    // If your test data is seeded correctly, you can make specific assertions
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('censusArea');
    }
  });

  it('should fetch housing starts by census area from actual backend', async () => {
    // Use an area that exists in your test database
    const areaName = "TestArea";
    const data = await getStartsByCensusArea(areaName);
    expect(data).toBeDefined();
  });
});