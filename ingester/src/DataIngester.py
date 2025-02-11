import os 
import requests
import time
from src.DatabaseHandler import DatabaseHandler
from src.housingdata.HousingData import HousingData

class DataIngester:
    def __init__(self, connect):
        self.db = DatabaseHandler(connect)
        self.api_url = os.getenv('API_URL')
        self.api_key = os.getenv('API_KEY')
        # print(f"API_URL: {self.api_url}")
        # print(f"API_KEY: {self.api_key}")

    def fetch_tasks(self):
        try:
            response = requests.get(
                self.api_url,
                headers={"Apikey": self.api_key},
                timeout=10
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"API request failed: {e}")
            return []
    
    def process_and_store(self):
        tasks = self.fetch_tasks()
        if not tasks:
            print("No data was retrived from API")
            return
        
        for task in tasks:
            try:
                housing_data = HousingData(
                    census_metropolitan_area=task["CMA"],
                    total_starts=task["Total_starts"],
                    total_complete=task["Total_complete"]
                )
                self.db.insert_housing_data(housing_data)
                print(f"Processed: {housing_data.census_metropolitan_area}")
            except KeyError as e:
                print(f"Skipping invalid task: Missing field {e}")
            except Exception as e:
                print(f"Error processing task: {e}")
    
if __name__ == "__main__":
    max_retries = 5
    for attempt in range(max_retries):
        try:
            ingester = DataIngester(True)
            ingester.process_and_store()
            break
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(5)
                continue
            raise
        
    