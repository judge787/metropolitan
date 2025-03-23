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
            with open(self.last_update_file, "r", encoding='utf-8') as f:
                date_str = f.read().strip()
                return date_str if date_str else None
        except FileNotFoundError:
            return None

    def save_last_update(self):
        """
        save_last_update: Saves current UTC date in last_update_file, formatted as YYYY-MM-DD.
        """
        current_date = datetime.now(timezone.utc).strftime("%Y-%m-%d")
        with open(self.last_update_file, "w", encoding='utf-8') as f:
            f.write(current_date)

    def fetch_batch(self, url, offset, params=None):
        """
        fetch_batch: Fetches a single batch of data from the API.
        Returns a single batch rather than accumulating all data.
        """
        if params is None:
            params = {}
        
        params["offset"] = offset
        headers = {"Apikey": self.api_key}
        
        try:
            response = requests.get(url, headers=headers, params=params, timeout=100)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as parse_error:
            print(f"Error fetching batch with offset {offset} from {url}: {parse_error}")
            return []

    def fetch_and_process_data(self, url, processor_func):
        """
        fetch_and_process_data: Orchestrates fetching and processing in batches.
        Takes a processor function that handles a single record.
        """
        params = {}
        offset = 0
        total_processed = 0
        
        # Add date filtering if available
        last_update = self.get_last_update()
        if last_update:
            try:
                last_update_formatted = datetime.strptime(last_update, '%Y-%m-%d')
                date_inclusive = (last_update_formatted - timedelta(days=1)).strftime('%Y-%m-%d')
                params["after"] = date_inclusive
            except ValueError as parse_error:
                print(f"Error parsing last ingestion date: {parse_error}")
                params["after"] = last_update

        start_time = time.time()
        
        while True:
            # Fetch a single batch
            data_batch = self.fetch_batch(url, offset, params)
            
            # Break if no more data
            if not data_batch:
                break
            
            # Process each record in this batch
            batch_processed = 0
            for record in data_batch:
                if processor_func(record):
                    batch_processed += 1
            
            total_processed += batch_processed
            
            print(f"Batch: offset={offset}, fetched={len(data_batch)}, processed={batch_processed}, "
                f"elapsed={time.time()-start_time:.2f}s")
            
            # Move to next batch
            offset += 5000
        
        print(f"Total processed: {total_processed}, total time: {time.time()-start_time:.2f}s")
        return total_processed

    def process_housing_data(self):
        """
        process_housing_data: Process housing data from the API.
        """
        def process_housing_record(record):
            try:
                housing_data = HousingData(
                    jsonid=record["id"],
                    census_metropolitan_area=record["CMA"],
                    month=record["Month"],
                    total_starts=record["Total_starts"],
                    total_complete=record["Total_complete"],
                    singles_starts=record["Singles_starts"],
                    semis_starts=record["Semis_starts"],
                    row_starts=record["Row_starts"],
                    apartment_starts=record["Apt_Other_starts"],
                    singles_complete=record["Singles_complete"],
                    semis_complete=record["Semis_complete"],
                    row_complete=record["Row_complete"],
                    apartment_complete=record["Apt_other_complete"]
                )
                self.db.insert_housing_data(housing_data)
                return True
            except KeyError as key_error:
                print(f"Skipping invalid housing data: Missing field {key_error}")
                return False
            except Exception as process_error:
                print(f"Error processing housing data: {process_error}")
                return False
        
        return self.fetch_and_process_data(self.api_housing, process_housing_record)

    def process_labour_market_data(self):
        """
        process_labour_market_data: Process labour market data from API.
        """
        def process_labour_record(record):
            try:
                labour_market_data = LabourMarketData(
                    jsonid=record["id"],
                    province=record["PROV"],
                    education_level=record["EDUC"],
                    labour_force_status=record["LFSSTAT"]
                )
                self.db.insert_labour_market_data(labour_market_data)
                return True
            except KeyError as key_error:
                print(f"Skipping invalid labour market data: Missing field {key_error}")
                return False
            except Exception as exception_error:
                print(f"Error processing labour market data: {exception_error}")
                return False
        
        return self.fetch_and_process_data(self.api_labour_market, process_labour_record)

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
