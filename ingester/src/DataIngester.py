"""
DataIngester.py: Receives data from data service & stores in database.
"""

import os
import time
from datetime import datetime, timedelta, timezone
import requests
from src.DatabaseHandler import DatabaseHandler
from src.housingdata.HousingData import HousingData
from src.labourMarketData.LabourMarketData import LabourMarketData


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
        self.api_labour_market = os.getenv("API_URL_LABOUR_MARKET")
        self.api_housing = os.getenv("API_URL_HOUSING")
        self.api_key = os.getenv("API_KEY")
        self.last_update_file = "lastUpdated.txt"

    def get_last_update(self):
        """
        get_last_update: Attempts to read lastUpdated.txt to get the last ingestion date.
        Returns date in YYYY-MM-DD format, or None if file doesn't exist.
        """
        try:
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
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching data from {url}: {e}")
            return []

    def process_housing_data(self):
        """
        process_housing_data: Process housing data from the API.
        """
        data = self.fetch_data(self.api_housing)
        if not data:
            print("No housing data was retrieved from API")
            return 0

        records_processed = 0
        for d in data:
            try:
                housing_data = HousingData(
                    census_metropolitan_area=d["CMA"],
                    month = d["Month"],
                    total_starts = d["Total_starts"],
                    total_complete = d["Total_complete"],
                    singles_starts = d["Singles_starts"],
                    semis_starts = d["Semis_starts"],
                    row_starts = d["Row_starts"],
                    apartment_starts = d["Apt_Other_starts"],
                    singles_complete = d["Singles_complete"],
                    semis_complete = d["Semis_complete"],
                    row_complete = d["Row_complete"],
                    apartment_complete = d["Apt_other_complete"]
                )
                self.db.insert_housing_data(housing_data)
                records_processed += 1
                print(f"Processed housing data: {housing_data.census_metropolitan_area}")
            except KeyError as e:
                print(f"Skipping invalid housing data: Missing field {e}")
            except Exception as e:
                print(f"Error processing housing data: {e}")
        
        return records_processed

    def process_labour_market_data(self):
        """
        process_labour_market_data: Process labour market data from API.
        """
        data = self.fetch_data(self.api_labour_market)
        if not data:
            print("No labour market data was retrieved from API")
            return 0

        records_processed = 0
        for d in data:
            try:
                # Using the exact field names from the API
                labour_market_data = LabourMarketData(
                    province=d["PROV"],
                    education_level=d["EDUC"],
                    labour_force_status=d["LFSSTAT"]
                )
                self.db.insert_labour_market_data(labour_market_data)
                records_processed += 1
                print(f"Processed labour market data for province: {labour_market_data.province}")
            except KeyError as e:
                print(f"Skipping invalid labour market data: Missing field {e}")
            except Exception as e:
                print(f"Error processing labour market data: {e}")
        
        return records_processed

    def process_and_store(self):
        """
        process_and_store: Process and store both housing and labour market data.
        """
        housing_records = self.process_housing_data()
        labour_records = self.process_labour_market_data()
        
        if housing_records > 0 or labour_records > 0:
            self.save_last_update()
            
        print(f"Total records processed: Housing={housing_records}, Labour Market={labour_records}")


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