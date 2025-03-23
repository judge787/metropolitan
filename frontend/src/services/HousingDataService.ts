import { HousingData } from "../types/HousingData";

const API_URL = '/api/housingStats';
console.log('API_URL:', API_URL);

export const getAllData = async (): Promise<HousingData[]> => {
  console.log('Fetching all data from:', `${API_URL}`);
  try {
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};

export const getData = async (id: number): Promise<HousingData> => {
  console.log(`Fetching data with id ${id} from:`, `${API_URL}/id/${id}`);  // Log the full endpoint
  try {
    const response = await fetch(`${API_URL}/id/${id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getStartsByCensusArea = async (censusArea: string) :Promise<number> => {
  console.log(`Fetching data for the city ${censusArea} from:`, `${API_URL}/starts/${censusArea}`);  // Log the full endpoint
  try {
    const response = await fetch(`${API_URL}/starts/${censusArea}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getCompletionsByCensusArea = async (censusArea: string): Promise<number> => {
  console.log(`Fetching completions data for the city ${censusArea} from:`, `${API_URL}/completions/${censusArea}`);
  try {
    const response = await fetch(`${API_URL}/completions/${censusArea}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching completions data:', error);
    throw error;
  }
};

// New interface for monthly data format used by DoubleBarChart
export interface MonthlyData {
  month: number;
  toronto: number;
  hamilton: number;
}

// New interface for processed housing data
export interface ProcessedHousingData {
  startsData: MonthlyData[];
  completionsData: MonthlyData[];
  availableMonths: number[];
}

export const fetchProcessedHousingData = async (): Promise<ProcessedHousingData> => {
  try {
    // Fetch all housing data
    const response = await fetch(`${API_URL}`);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const allData = await response.json();
    console.log('Raw data from API:', allData);
    
    // Process the data to group by month
    const startsDataMap = new Map<number, MonthlyData>();
    const completionsDataMap = new Map<number, MonthlyData>();
    const monthsSet = new Set<number>();
    
    allData.forEach((item: any) => {
      // Handle potentially missing month data - default to 1 if not present
      const month = item.month !== null && item.month !== undefined ? 
        parseInt(item.month, 10) : 1;
      
      // Add to available months
      monthsSet.add(month);
      
      // Debug log for problematic records
      if (item.month === null || item.month === undefined) {
        console.warn('Record with missing month:', item);
      }
      
      // Process starts data
      if (!startsDataMap.has(month)) {
        startsDataMap.set(month, {
          month,
          toronto: 0,
          hamilton: 0
        });
      }
      
      // Process completions data
      if (!completionsDataMap.has(month)) {
        completionsDataMap.set(month, {
          month,
          toronto: 0,
          hamilton: 0
        });
      }
      
      // Update data based on census area
      if (item.censusArea === "Toronto") {
        const existingStartsData = startsDataMap.get(month)!;
        existingStartsData.toronto += item.totalStarts || 0;
        startsDataMap.set(month, existingStartsData);
        
        const existingCompletionsData = completionsDataMap.get(month)!;
        existingCompletionsData.toronto += item.totalComplete || 0;
        completionsDataMap.set(month, existingCompletionsData);
      } else if (item.censusArea === "Hamilton") {
        const existingStartsData = startsDataMap.get(month)!;
        existingStartsData.hamilton += item.totalStarts || 0;
        startsDataMap.set(month, existingStartsData);
        
        const existingCompletionsData = completionsDataMap.get(month)!;
        existingCompletionsData.hamilton += item.totalComplete || 0;
        completionsDataMap.set(month, existingCompletionsData);
      }
    });
    
    // Convert maps to arrays and sort by month
    const startsData = Array.from(startsDataMap.values()).sort((a, b) => a.month - b.month);
    const completionsData = Array.from(completionsDataMap.values()).sort((a, b) => a.month - b.month);
    const availableMonths = Array.from(monthsSet).sort((a, b) => a - b);
    
    console.log('Processed starts data:', startsData);
    console.log('Processed completions data:', completionsData);
    console.log('Available months:', availableMonths);
    
    return {
      startsData,
      completionsData,
      availableMonths
    };
  } catch (error) {
    console.error('Error in fetchProcessedHousingData:', error);
    // Return empty data structure instead of throwing
    return {
      startsData: [],
      completionsData: [],
      availableMonths: []
    };
  }
};
