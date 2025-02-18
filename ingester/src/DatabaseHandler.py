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
                        total_starts INT DEFAULT 0 COMMENT 'Total Starts',
                        total_complete INT DEFAULT 0 COMMENT 'Total Complete'
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
            # Check if housing data exists
            cursor.execute(
                "SELECT id FROM housing_data WHERE census_metropolitan_area = ? AND total_starts = ? AND total_complete = ?",
                (
                    housing_data.census_metropolitan_area,
                    housing_data.total_starts,
                    housing_data.total_complete,
                ),
            )
            if cursor.fetchone() is None:
                cursor.execute(
                    "INSERT INTO housing_data (census_metropolitan_area, total_starts, total_complete) VALUES (?, ?, ?)",
                    (
                        housing_data.census_metropolitan_area,
                        housing_data.total_starts,
                        housing_data.total_complete,
                    ),
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
        except:
            pass
