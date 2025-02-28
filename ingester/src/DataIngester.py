"""
DataIngester.py: Receives data from data service & stores in database.
"""

import os
import time
import requests
from src.DatabaseHandler import DatabaseHandler
from src.housingdata.HousingData import HousingData


class DataIngester:
    """
    DataIngester class: Receives data from the data service using joblen's 
    API key.
    """
    def __init__(self, connect):
        """
        __init__: Creates a Database Handler & initializes the data ingester
        with the joblen API key & URL.
        """
        self.db = DatabaseHandler(connect)
        self.api_url = os.getenv("API_URL")
        self.api_key = os.getenv("API_KEY")

    def fetch_tasks(self):
        """
        fetch_tasks: Attempts to get tasks from the data service using the API key.
        """
        try:
            response = requests.get(
                self.api_url, headers={"Apikey": self.api_key}, timeout=100,
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"API request failed: {e}")
            return []

    def process_and_store(self):
        """
        process_and_store: Attempts to store each task received from `fetch_tasks()` 
        to the database.
        """
        tasks = self.fetch_tasks()
        if not tasks:
            print("No data was retrived from API")
            return

        for task in tasks:
            try:
                housing_data = HousingData(
                    census_metropolitan_area=task["CMA"],
                    month = task["Month"],
                    total_starts=task["Total_starts"],
                    total_complete=task["Total_complete"],
                )
                self.db.insert_housing_data(housing_data)
                print(f"Processed: {housing_data.census_metropolitan_area}")
            except KeyError as e:
                print(f"Skipping invalid task: Missing field {e}")
            except Exception as e:
                print(f"Error processing task: {e}")

    # def process_and_store(self, max_retries=3):
    #     """
    #     process_and_store: Attempts to store each task received from `fetch_tasks()` 
    #     to the database. Retries fetching tasks up to max_retries times if initial 
    #     attempt returns no data.
    #     """
    #     tasks = None
    #     for retry in range(max_retries):
    #         tasks = self.fetch_tasks()
    #         if tasks:
    #             break
            
    #         if retry < max_retries - 1:
    #             # Calculate wait time using exponential backoff formula
    #             # 1st retry: 2 seconds, 2nd: 4 seconds, 3rd: 8 seconds
    #             wait_time = (2 ** retry) * 2  # Exponential backoff: 2, 4, 8 seconds
    #             print(f"No data retrieved from API, retrying in {wait_time} seconds (attempt {retry + 1}/{max_retries})")
    #             time.sleep(wait_time)
        
    #     if not tasks:
    #         print(f"No data was retrieved from API after {max_retries} attempts")
    #         return

    #     for task in tasks:
    #         try:
    #             housing_data = HousingData(
    #                 census_metropolitan_area=task["CMA"],
    #                 month = task["Month"],
    #                 total_starts=task["Total_starts"],
    #                 total_complete=task["Total_complete"],
    #             )
    #             self.db.insert_housing_data(housing_data)
    #             print(f"Processed: {housing_data.census_metropolitan_area}")
    #         except KeyError as e:
    #             print(f"Skipping invalid task: Missing field {e}")
    #         except Exception as e:
    #             print(f"Error processing task: {e}")

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
