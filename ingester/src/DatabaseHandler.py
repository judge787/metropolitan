"""
DatabaseHandler.py: OO object to handle putting data into the database.
"""
import os
import sys
import time
import mariadb


class DatabaseHandler:
    """
    DatabaseHandler class: Handles connection & data transfer to the database.
    """
    def __init__(self, connect, max_retries=5, retry_delay=5):
        """
        __init__: Initializes the object & tries to connect.
        """
        self.conn = None
        self.max_retries = max_retries
        self.retry_delay = retry_delay
        if connect:
            self.connect()

    def connect(self):
        """
        connect: Attempts to establish a connection to the database `max_retries` times.
        """
        for attempt in range(self.max_retries):
            try:
                self.conn = mariadb.connect(
                    user=os.getenv("DB_USER", "root"),
                    password=os.getenv("DB_PASSWORD", "pwd"),
                    host=os.getenv("DB_HOST", "database"),
                    port=3306,
                    database=os.getenv("DB_DATABASE", "template_db"),
                )
                print("Successfully connected to MariaDB database")
                self.create_table()
                return
            except mariadb.Error as e:
                print(f"Connection attempt {attempt + 1} failed: {e}")
                if attempt < self.max_retries - 1:
                    time.sleep(self.retry_delay)
        sys.exit("FATAL: Failed to connect to database after multiple attempts")

    def create_table(self):
        """
        create_table: Creates the database table if it doesn't exist.
        """
        cursor = self.conn.cursor()
        try:
            cursor.execute(
                """
                        CREATE TABLE IF NOT EXISTS housing_data (
                        id INT AUTO_INCREMENT PRIMARY KEY COMMENT 'Primary Key',
                        census_metropolitan_area VARCHAR(255) COMMENT 'Census Metropolitan Area',
                        month INT DEFAULT NULL COMMENT 'Month',
                        total_starts INT DEFAULT 0 COMMENT 'Total Starts',
                        total_complete INT DEFAULT 0 COMMENT 'Total Complete',
                        singles_starts INT DEFAULT 0 COMMENT 'Singles Starts',
                        semis_starts INT DEFAULT 0 COMMENT 'Semis Starts',
                        row_starts INT DEFAULT 0 COMMENT 'Row Starts',
                        apartment_starts INT DEFAULT 0 COMMENT 'Apartment Starts',
                        singles_complete INT DEFAULT 0 COMMENT 'Singles Complete',
                        semis_complete INT DEFAULT 0 COMMENT 'Semis Complete',
                        row_complete INT DEFAULT 0 COMMENT 'Row Complete',
                        apartment_complete INT DEFAULT 0 COMMENT 'Apartment Complete'
                    )
            """
            )
            self.conn.commit()
        except mariadb.Error as e:
            print(f"Error creating table: {e}")
        finally:
            cursor.close()

    def insert_housing_data(self, housing_data):
        """
        insert_housing_data: Insert a new housing data if it doesn't exist.
        """
        cursor = self.conn.cursor()
        try:
            # Convert empty strings to integers for numeric fields
            month = 0 if housing_data.month == "" else housing_data.month
            total_starts = 0 if housing_data.total_starts == "" else housing_data.total_starts
            total_complete = 0 if housing_data.total_complete == "" else housing_data.total_complete
            singles_starts = 0 if housing_data.singles_starts == "" else housing_data.singles_starts
            semis_starts = 0 if housing_data.semis_starts == "" else housing_data.semis_starts
            row_starts = 0 if housing_data.row_starts == "" else housing_data.row_starts
            apartment_starts = 0 if housing_data.apartment_starts == "" else housing_data.apartment_starts
            singles_complete = 0 if housing_data.singles_complete == "" else housing_data.singles_complete
            semis_complete = 0 if housing_data.semis_complete == "" else housing_data.semis_complete
            row_complete = 0 if housing_data.row_complete == "" else housing_data.row_complete
            apartment_complete = 0 if housing_data.apartment_complete == "" else housing_data.apartment_complete
            
            # First execute the query to check if housing data exists with all fields
            cursor.execute(
                """SELECT id FROM housing_data 
                WHERE census_metropolitan_area = ? 
                AND month = ? 
                AND total_starts = ? 
                AND total_complete = ? 
                AND singles_starts = ? 
                AND semis_starts = ? 
                AND row_starts = ? 
                AND apartment_starts = ? 
                AND singles_complete = ? 
                AND semis_complete = ? 
                AND row_complete = ? 
                AND apartment_complete = ?""",
                (
                    housing_data.census_metropolitan_area,
                    total_starts,
                    total_complete,
                    month,
                    singles_starts,
                    semis_starts,
                    row_starts,
                    apartment_starts,
                    singles_complete,
                    semis_complete,
                    row_complete,
                    apartment_complete
                )
            )
            
            # Now we can safely call fetchone() after executing a query
            result = cursor.fetchone()
            
            if result is None:
                # Insert new record if no exact match exists
                cursor.execute(
                    """INSERT INTO housing_data 
                    (census_metropolitan_area, month, total_starts, total_complete, 
                    singles_starts, semis_starts, row_starts, apartment_starts,
                    singles_complete, semis_complete, row_complete, apartment_complete)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                    (
                        housing_data.census_metropolitan_area,
                        housing_data.month,
                        total_starts,
                        total_complete,
                        singles_starts,
                        semis_starts,
                        row_starts,
                        apartment_starts,
                        singles_complete,
                        semis_complete,
                        row_complete,
                        apartment_complete
                    )
                )
                self.conn.commit()
        except mariadb.Error as e:
            print(f"Error inserting housing data: {e}")
        finally:
            cursor.close()

    def close(self):
        """
        close: Close database connection.
        """
        if self.conn:
            self.conn.close()
            print("Closed database connection")

    def __del__(self):
        """
        __del__: Object destructor.
        """
        try:
            self.close()
        except Exception:
            pass
