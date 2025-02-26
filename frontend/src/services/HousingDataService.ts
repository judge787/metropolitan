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

export const getStartsByCensusArea = async (censusArea: string): Promise<number> => {
  const url = `${API_URL}/starts/${censusArea}`;
  console.log(`Fetching data for the city ${censusArea} from: ${url}`); // Log the full endpoint

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const text = await response.text(); 
    if (!text) {
      throw new Error(`Empty response from server for ${censusArea}`);
    }

    const data = JSON.parse(text); 
    if (typeof data !== "number") {
      throw new Error(`Unexpected data format for ${censusArea}: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error(`Error fetching data for ${censusArea}:`, error);
    throw error;
  }
};

