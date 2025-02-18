import { HousingData } from "../types/HousingData";

const API_URL = '/api/data';
console.log('API_URL:', API_URL);

export const getAllData = async (): Promise<HousingData[]> => {
  console.log('Fetching all data from:', `/api/data`);
  try {
    const response = await fetch(`/api/data`);
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
    const response = await fetch(`${API_URL}/${id}`);
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
