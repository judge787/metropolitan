import pytest
import requests
from unittest.mock import patch, MagicMock, mock_open
from src.DataIngester import DataIngester

@pytest.fixture
def data_ingester():
    with patch('src.DataIngester.DatabaseHandler'):
        ingester = DataIngester(False)
        yield ingester

@pytest.fixture
def mock_api_response():
    return [
        {
            "id": 1,
            "CMA": "TestCMA",
            "Month": 10,
            "Total_starts": 10,
            "Total_complete": 5,
            "Singles_starts": 3,
            "Semis_starts": 2,
            "Row_starts": 1,
            "Apt_Other_starts": 4,
            "Singles_complete": 1,
            "Semis_complete": 1,
            "Row_complete": 1,
            "Apt_other_complete": 2
        }
    ]

@pytest.fixture
def mock_labour_api_response():
    return [
        {
            "id" : "1",
            "PROV": "48",
            "EDUC": "2", 
            "LFSSTAT": "4"
        }
    ]

def test_get_last_update_file_exists(data_ingester):
    with patch("builtins.open", mock_open(read_data = '2025-02-27')):
        assert data_ingester.get_last_update() == "2025-02-27"

def test_get_last_update_file_missing(data_ingester):
    with patch("builtins.open", side_effect = FileNotFoundError):
        assert data_ingester.get_last_update() is None

def test_fetch_data_with_last_update(data_ingester, mock_api_response):
    mock_response = MagicMock()
    mock_response.json.return_value = mock_api_response
    mock_response.raise_for_status.return_value = None

    with patch('requests.get', return_value = mock_response) as mock_get, \
         patch.object(data_ingester, 'get_last_update', return_value = '2025-02-27'):
        
        data = data_ingester.fetch_data(data_ingester.api_housing)
        mock_get.assert_called_once_with(
            data_ingester.api_housing,
            headers = {"Apikey": data_ingester.api_key},
            params = {'after': '2025-02-26'}, # one day before
            timeout = 100
        )
        assert data == mock_api_response

def test_fetch_data_no_last_update(data_ingester, mock_api_response):
    mock_response = MagicMock()
    mock_response.json.return_value = mock_api_response
    mock_response.raise_for_status.return_value = None

    with patch('requests.get', return_value = mock_response) as mock_get, \
         patch.object(data_ingester, 'get_last_update', return_value = None):
        
        data = data_ingester.fetch_data(data_ingester.api_housing)
        mock_get.assert_called_once_with(
            data_ingester.api_housing,
            headers = {"Apikey": data_ingester.api_key},
            params = {},
            timeout = 100
        )
        assert data == mock_api_response

def test_fetch_data_failure(data_ingester):
    with patch('requests.get', side_effect = requests.exceptions.RequestException("API request failed")) as mock_get, \
         patch.object(data_ingester, 'get_last_update', return_value = None):
        
        data = data_ingester.fetch_data(data_ingester.api_housing)
        mock_get.assert_called_once()
        assert data == []

def test_fetch_data_http_error(data_ingester):
    mock_response = MagicMock()
    mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("HTTP error")

    with patch('requests.get', return_value = mock_response) as mock_get, \
         patch.object(data_ingester, 'get_last_update', return_value = None):
        
        data = data_ingester.fetch_data(data_ingester.api_housing)
        mock_get.assert_called_once()
        assert data == []


def test_process_and_store_no_data(data_ingester):
    with patch.object(data_ingester, 'process_housing_data', return_value=0), \
         patch.object(data_ingester, 'process_labour_market_data', return_value=0), \
         patch.object(data_ingester, 'save_last_update') as mock_save:
        
        data_ingester.process_and_store()
        mock_save.assert_not_called()

def test_process_and_store_success(data_ingester):
    with patch.object(data_ingester, 'process_housing_data', return_value=1), \
         patch.object(data_ingester, 'process_labour_market_data', return_value=1), \
         patch.object(data_ingester, 'save_last_update') as mock_save:
        
        data_ingester.process_and_store()
        mock_save.assert_called_once()

def test_process_and_store_housing_only(data_ingester):
    with patch.object(data_ingester, 'process_housing_data', return_value=1), \
         patch.object(data_ingester, 'process_labour_market_data', return_value=0), \
         patch.object(data_ingester, 'save_last_update') as mock_save:
        
        data_ingester.process_and_store()
        mock_save.assert_called_once()

def test_process_and_store_labour_only(data_ingester):
    with patch.object(data_ingester, 'process_housing_data', return_value=0), \
         patch.object(data_ingester, 'process_labour_market_data', return_value=1), \
         patch.object(data_ingester, 'save_last_update') as mock_save:
        
        data_ingester.process_and_store()
        mock_save.assert_called_once()

def test_process_housing_data_success(data_ingester, mock_api_response):
    with patch.object(data_ingester, 'fetch_data', return_value=mock_api_response), \
         patch.object(data_ingester.db, 'insert_housing_data') as mock_db:
        
        records = data_ingester.process_housing_data()
        mock_db.assert_called_once()
        assert records == 1

def test_save_last_update(data_ingester):
    mock_file = mock_open()
    with patch("builtins.open", mock_file):
        data_ingester.save_last_update()
        mock_file.assert_called_once()
        # Check that write was called with a string containing today's date
        mock_file().write.assert_called_once()
        assert len(mock_file().write.call_args[0][0]) == 10  # YYYY-MM-DD format

def test_process_housing_data_empty(data_ingester):
    with patch.object(data_ingester, 'fetch_data', return_value=[]):
        records = data_ingester.process_housing_data()
        assert records == 0

def test_process_housing_data_key_error(data_ingester):
    # Missing required field
    incomplete_data = [{"CMA": "TestCMA", "Month": 10}]  # Missing other required fields
    
    with patch.object(data_ingester, 'fetch_data', return_value=incomplete_data):
        records = data_ingester.process_housing_data()
        assert records == 0  # No records should be processed due to KeyError

def test_process_housing_data_exception(data_ingester):
    with patch.object(data_ingester, 'fetch_data', return_value=[{"CMA": "TestCMA", "Month": 10, "Total_starts": 10,
                     "Total_complete": 5, "Singles_starts": 3, "Semis_starts": 2, "Row_starts": 1,
                     "Apt_Other_starts": 4, "Singles_complete": 1, "Semis_complete": 1, "Row_complete": 1,
                     "Apt_other_complete": 2}]), \
         patch.object(data_ingester.db, 'insert_housing_data', side_effect=Exception("DB Error")):
        
        records = data_ingester.process_housing_data()
        assert records == 0  # No records should be processed due to Exception

def test_process_labour_market_data_success(data_ingester, mock_labour_api_response):
    with patch.object(data_ingester, 'fetch_data', return_value=mock_labour_api_response), \
         patch.object(data_ingester.db, 'insert_labour_market_data') as mock_db:
        
        records = data_ingester.process_labour_market_data()
        mock_db.assert_called_once()
        assert records == 1

def test_process_labour_market_data_empty(data_ingester):
    with patch.object(data_ingester, 'fetch_data', return_value=[]):
        records = data_ingester.process_labour_market_data()
        assert records == 0

def test_process_labour_market_data_key_error(data_ingester):
    # Missing required field
    incomplete_data = [{"PROV": "48"}]  # Missing other required fields
    
    with patch.object(data_ingester, 'fetch_data', return_value=incomplete_data):
        records = data_ingester.process_labour_market_data()
        assert records == 0  # No records should be processed due to KeyError

def test_process_labour_market_data_exception(data_ingester, mock_labour_api_response):
    with patch.object(data_ingester, 'fetch_data', return_value=mock_labour_api_response), \
         patch.object(data_ingester.db, 'insert_labour_market_data', side_effect=Exception("DB Error")):
        
        records = data_ingester.process_labour_market_data()
        assert records == 0  # No records should be processed due to Exception
def test_fetch_data_invalid_date_format(data_ingester):
    mock_response = MagicMock()
    mock_response.json.return_value = []
    mock_response.raise_for_status.return_value = None
    
    with patch('requests.get', return_value=mock_response) as mock_get, \
         patch.object(data_ingester, 'get_last_update', return_value='invalid-date'):
        
        data_ingester.fetch_data(data_ingester.api_housing)
        # Should still make the request but with the raw invalid date
        mock_get.assert_called_once()
        assert 'after' in mock_get.call_args[1]['params']