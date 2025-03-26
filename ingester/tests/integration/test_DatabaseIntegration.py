import os
import sys
import pytest
import mariadb
from unittest.mock import patch, MagicMock

# Add the src directory to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../src')))

from DatabaseHandler import DatabaseHandler
from housingdata.HousingData import HousingData
from labourMarketData.LabourMarketData import LabourMarketData

class TestDatabaseIntegration:
    """Integration tests for DatabaseHandler with a real database"""
    
    @pytest.fixture
    def db_handler(self):
        """Create database connection for tests"""
        # Pass connection parameters explicitly instead of relying on environment variables
        handler = DatabaseHandler(
            connect=False  # Don't connect in constructor, we'll do it manually
        )
        
        # Manual connection with explicit parameters
        try:
            handler.conn = mariadb.connect(
                user="root",
                password="pwd",
                host="test-db",  # Must match service name in compose.ingester.yaml
                port=3306,
                database="template_db"
            )
            print("Test fixture: Connected to database successfully")
        except mariadb.Error as e:
            pytest.fail(f"Could not connect to database: {e}")
            
        yield handler
        
        # Clean up
        if handler.conn:
            handler.conn.close()
    
    def test_connection(self, db_handler):
        """Test that we can connect to the database"""
        assert db_handler.conn is not None
        print("Database connection established successfully")
    
    def test_connection(self, db_handler):
        """Test that we can connect to the database"""
        # If connection failed, this would raise an exception
        assert db_handler.conn is not None
        print("Database connection established successfully")
        
    def test_create_tables(self, db_handler):
        """Test creating tables in the database"""
        # This should not raise an exception
        db_handler.create_table()
        print("Tables created successfully")
        
        # Verify tables exist
        cursor = db_handler.conn.cursor()
        cursor.execute("SHOW TABLES")
        tables = [table[0] for table in cursor.fetchall()]
        cursor.close()
        
        print(f"Found tables: {tables}")
        assert "housing_data" in tables
        assert "labour_market_data" in tables
        
    def test_insert_and_query_housing_data(self, db_handler):
        """Test inserting and querying housing data"""
        # Create test data
        housing_data = HousingData(
            jsonid=2,
            census_metropolitan_area="TestCity",
            month=3,
            total_starts=150,
            total_complete=100,
            singles_starts=50,
            semis_starts=30,
            row_starts=30,
            apartment_starts=40,
            singles_complete=35,
            semis_complete=25,
            row_complete=20,
            apartment_complete=20
        )
        
        # Insert data
        db_handler.insert_housing_data(housing_data)
        print("Housing data inserted successfully")
        
        # Query the data
        cursor = db_handler.conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM housing_data WHERE census_metropolitan_area = 'TestCity'")
        result = cursor.fetchone()
        cursor.close()
        
        # Verify data was inserted correctly
        assert result is not None
        assert result['census_metropolitan_area'] == "TestCity"
        assert result['total_starts'] == 150
        assert result['total_complete'] == 100
        print("Data verification completed successfully")