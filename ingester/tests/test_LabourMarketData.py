"""
Test module for LabourMarketData.py
"""
import unittest
import os
import sys

# Add the src directory to the path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../src')))
from labourMarketData.LabourMarketData import LabourMarketData


class TestLabourMarketData(unittest.TestCase):
    """Test cases for the LabourMarketData class"""

    def setUp(self):
        """Set up test fixtures"""
        self.labour_data = LabourMarketData(
            jsonid=12345,
            province=1,
            education_level=3,
            labour_force_status=4
        )

    def test_initialization(self):
        """Test object initialization"""
        self.assertEqual(self.labour_data.jsonid, 12345)
        self.assertEqual(self.labour_data.province, 1)
        self.assertEqual(self.labour_data.education_level, 3)
        self.assertEqual(self.labour_data.labour_force_status, 4)

    def test_getters(self):
        """Test getter methods"""
        self.assertEqual(self.labour_data.jsonid, 12345)
        self.assertEqual(self.labour_data.province, 1)
        self.assertEqual(self.labour_data.education_level, 3)
        self.assertEqual(self.labour_data.labour_force_status, 4)

    def test_setters(self):
        """Test setter methods"""
        self.labour_data.jsonid = 54321
        self.assertEqual(self.labour_data.jsonid, 54321)
        
        self.labour_data.province = 2
        self.assertEqual(self.labour_data.province, 2)
        
        self.labour_data.education_level = 5
        self.assertEqual(self.labour_data.education_level, 5)
        
        self.labour_data.labour_force_status = 6
        self.assertEqual(self.labour_data.labour_force_status, 6)

    def test_repr(self):
        """Test the __repr__ method"""
        repr_str = repr(self.labour_data)
        self.assertIn("jsonid=12345", repr_str)
        self.assertIn("province=1", repr_str)
        self.assertIn("education_level=3", repr_str)
        self.assertIn("labour_force_status=4", repr_str)

    def test_default_initialization(self):
        """Test initialization with default values"""
        default_data = LabourMarketData()
        self.assertEqual(default_data.jsonid, "")
        self.assertEqual(default_data.province, "")
        self.assertEqual(default_data.education_level, "")
        self.assertEqual(default_data.labour_force_status, "")


if __name__ == "__main__":
    unittest.main()