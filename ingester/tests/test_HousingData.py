"""
Test module for HousingData.py
"""

import unittest
import os
import sys

# Add the src directory to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from housingdata.HousingData import HousingData

class TestHousingData(unittest.TestCase):
    """Test cases for the HousingData class"""

    def setUp(self):
        """Set up test fixtures"""
        self.housing_data = HousingData(
            jsonid="1",
            census_metropolitan_area="Toronto",
            month=6,
            total_starts=100,
            total_complete=80,
            singles_starts=30,
            semis_starts=20,
            row_starts=20,
            apartment_starts=30,
            singles_complete=25,
            semis_complete=15,
            row_complete=15,
            apartment_complete=25
        )

    def test_initialization(self):
        """Test object initialization"""
        self.assertEqual(self.housing_data.jsonid, "1")
        self.assertEqual(self.housing_data.census_metropolitan_area, "Toronto")
        self.assertEqual(self.housing_data.month, 6)
        self.assertEqual(self.housing_data.total_starts, 100)
        self.assertEqual(self.housing_data.total_complete, 80)

    def test_starts_getters(self):
        """Test getters for starts properties"""
        self.assertEqual(self.housing_data.singles_starts, 30)
        self.assertEqual(self.housing_data.semis_starts, 20)
        self.assertEqual(self.housing_data.row_starts, 20)
        self.assertEqual(self.housing_data.apartment_starts, 30)

    def test_complete_getters(self):
        """Test getters for complete properties"""
        self.assertEqual(self.housing_data.singles_complete, 25)
        self.assertEqual(self.housing_data.semis_complete, 15)
        self.assertEqual(self.housing_data.row_complete, 15)
        self.assertEqual(self.housing_data.apartment_complete, 25)

    def test_setters(self):
        """Test all setter methods"""
        self.housing_data.jsonid = "2"
        self.assertEqual(self.housing_data.jsonid, "2")
        
        self.housing_data.census_metropolitan_area = "Vancouver"
        self.assertEqual(self.housing_data.census_metropolitan_area, "Vancouver")
        
        self.housing_data.month = 7
        self.assertEqual(self.housing_data.month, 7)
        
        self.housing_data.total_starts = 200
        self.assertEqual(self.housing_data.total_starts, 200)
        
        self.housing_data.total_complete = 160
        self.assertEqual(self.housing_data.total_complete, 160)
        
        # Starts setters
        self.housing_data.singles_starts = 60
        self.assertEqual(self.housing_data.singles_starts, 60)
        
        self.housing_data.semis_starts = 40
        self.assertEqual(self.housing_data.semis_starts, 40)
        
        self.housing_data.row_starts = 40
        self.assertEqual(self.housing_data.row_starts, 40)
        
        self.housing_data.apartment_starts = 60
        self.assertEqual(self.housing_data.apartment_starts, 60)
        
        # Complete setters
        self.housing_data.singles_complete = 50
        self.assertEqual(self.housing_data.singles_complete, 50)
        
        self.housing_data.semis_complete = 30
        self.assertEqual(self.housing_data.semis_complete, 30)
        
        self.housing_data.row_complete = 30
        self.assertEqual(self.housing_data.row_complete, 30)
        
        self.housing_data.apartment_complete = 50
        self.assertEqual(self.housing_data.apartment_complete, 50)

    def test_repr(self):
        """Test the __repr__ method"""
        repr_str = repr(self.housing_data)
        self.assertIn("jsonid='1'", repr_str)
        self.assertIn("census_metropolitan_area='Toronto'", repr_str)
        self.assertIn("month=6", repr_str)
        self.assertIn("total_starts=100", repr_str)
        self.assertIn("total_complete=80", repr_str)
        self.assertIn("singles_starts=30", repr_str)
        self.assertIn("semis_starts=20", repr_str)
        self.assertIn("row_starts=20", repr_str)
        self.assertIn("apartment_starts=30", repr_str)
        self.assertIn("singles_complete=25", repr_str)
        self.assertIn("semis_complete=15", repr_str)
        self.assertIn("row_complete=15", repr_str)
        self.assertIn("apartment_complete=25", repr_str)


if __name__ == "__main__":
    unittest.main()
