"""
DataIngester.py: Receives data from data service & stores in database.
"""

import os
import time
from datetime import datetime, timedelta, timezone
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
        self.api_housing = os.getenv("API_URL_HOUSING")
        self.api_key = os.getenv("API_KEY")
        self.last_update_file = "lastUpdated.txt"

    def get_last_update(self):
        """
        get_last_update: Attempts to read lastUpdated.txt to get the last ingestion date.
        Returns date in YYYY-MM-DD format, or None if file doesn't exist.
        """
        try:
<<<<<<< HEAD
            response = requests.get(
                self.api_url, headers={"Apikey": self.api_key}, timeout=100,
            )
=======
            with open(self.last_update_file, "r") as f:
                date_str = f.read().strip()
                return date_str if date_str else None
        except FileNotFoundError:
            return None
    
    def save_last_update(self):
        """
        save_last_update: Saves current UTC date in last_update_file, formatted as YYYY-MM-DD.
        """
        current_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        with open(self.last_update_file, "w") as f:
            f.write(current_date)

    def fetch_data(self, url):
        """
        fetch_data: Attempts to get data from the endpoint specified by {url}.
        If there is a valid last updated date, only fetch data from that date onwards.
        """
        headers = {"Apikey": self.api_key}
        params = {}
        last_update = self.get_last_update()
        if last_update:
            try:
                last_update_formatted = datetime.strptime(last_update, '%Y-%m-%d')
                # subtract one day to make the original date inclusive
                date_inclusive = (last_update_formatted - timedelta(days = 1)).strftime('%Y-%m-%d')
                params["after"] = date_inclusive
            except Exception as e:
                print(f"Error parsing last ingestion date: {e}")
                params["after"] = last_update

        try:
            response = requests.get(url, headers = headers, params = params, timeout = 100)
>>>>>>> a450add9d4f7eb174b3e43fe7a3c94a47b53b2fc
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from {url}: {e}")
            return []

    def process_and_store(self):
        """
        process_and_store: Attempts to store each task received from `fetch_tasks()` 
        to the database.
        """
        data = self.fetch_data(self.api_housing)
        if not data:
            print("No data was retrived from API")
            return

        for d in data:
            try:
                housing_data = HousingData(
                    census_metropolitan_area=d["CMA"],
                    month = d["Month"],
                    total_starts = d["Total_starts"],
                    total_complete = d["Total_complete"],
                )
                self.db.insert_housing_data(housing_data)
                
                print(f"Processed: {housing_data.census_metropolitan_area}")
                self.save_last_update()
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
