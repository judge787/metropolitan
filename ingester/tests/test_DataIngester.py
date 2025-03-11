import pytest
import requests
from unittest.mock import patch, MagicMock, mock_open
from src.DataIngester import DataIngester

@pytest.fixture
def data_ingester():
    with patch('src.DataIngester.DatabaseHandler') as MockDatabaseHandler:
        ingester = DataIngester(False)
        yield ingester

@pytest.fixture
def mock_api_response():
    return [
        {
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

def test_fetch_data_with_last_update(data_ingester, mock_housing_api_response):
    mock_response = MagicMock()
    mock_response.json.return_value = mock_housing_api_response
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


def test_fetch_data_no_last_update(data_ingester, mock_housing_api_response):
    mock_response = MagicMock()
    mock_response.json.return_value = mock_housing_api_response
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

def test_process_housing_data_no_data(data_ingester):
    with patch.object(data_ingester, 'fetch_data', return_value = []), \
         patch.object(data_ingester.db, 'insert_housing_data') as mock_db:
        
        records = data_ingester.process_housing_data()
        mock_db.assert_not_called()
        assert records == 0

def test_process_housing_data_success(data_ingester, mock_housing_api_response):
    with patch.object(data_ingester, 'fetch_data', return_value = mock_housing_api_response), \
         patch.object(data_ingester.db, 'insert_housing_data') as mock_db:
        
        records = data_ingester.process_housing_data()
        mock_db.assert_called_once()
        assert records == 1

def test_process_labour_market_data_no_data(data_ingester):
    with patch.object(data_ingester, 'fetch_data', return_value = []), \
         patch.object(data_ingester.db, 'insert_labour_market_data') as mock_db:
        
        records = data_ingester.process_labour_market_data()
        mock_db.assert_not_called()
        assert records == 0

def test_process_labour_market_data_success(data_ingester, mock_labour_api_response):
    with patch.object(data_ingester, 'fetch_data', return_value = mock_labour_api_response), \
         patch.object(data_ingester.db, 'insert_labour_market_data') as mock_db:
        
        records = data_ingester.process_labour_market_data()
        mock_db.assert_called_once()
        assert records == 1

def test_process_and_store_no_data(data_ingester):
    with patch.object(data_ingester, 'process_housing_data', return_value=0) as mock_housing, \
         patch.object(data_ingester, 'process_labour_market_data', return_value=0) as mock_labour, \
         patch.object(data_ingester, 'save_last_update') as mock_save:
        
        data_ingester.process_and_store()
        mock_housing.assert_called_once()
        mock_labour.assert_called_once()
        mock_save.assert_not_called()  # No data processed, shouldn't save last update
def test_process_and_store_housing_only(data_ingester):
    with patch.object(data_ingester, 'process_housing_data', return_value=1) as mock_housing, \
         patch.object(data_ingester, 'process_labour_market_data', return_value=0) as mock_labour, \
         patch.object(data_ingester, 'save_last_update') as mock_save:
        
        data_ingester.process_and_store()
        mock_housing.assert_called_once()
        mock_labour.assert_called_once()
        mock_save.assert_called_once()  # Should save last update

def test_process_and_store_labour_only(data_ingester):
    with patch.object(data_ingester, 'process_housing_data', return_value=0) as mock_housing, \
         patch.object(data_ingester, 'process_labour_market_data', return_value=1) as mock_labour, \
         patch.object(data_ingester, 'save_last_update') as mock_save:
        
        data_ingester.process_and_store()
        mock_housing.assert_called_once()
        mock_labour.assert_called_once()
        mock_save.assert_called_once()  # Should save last update

def test_process_and_store_both_data(data_ingester):
    with patch.object(data_ingester, 'process_housing_data', return_value=1) as mock_housing, \
         patch.object(data_ingester, 'process_labour_market_data', return_value=1) as mock_labour, \
         patch.object(data_ingester, 'save_last_update') as mock_save:
        
        data_ingester.process_and_store()
        mock_housing.assert_called_once()
        mock_labour.assert_called_once()
        mock_save.assert_called_once() 



        #  # Verify correct fields are passed
        # args, _ = mock_db.call_args
        # housing_data = args[0]
        
        # assert housing_data.census_metropolitan_area == "TestCMA"
        # assert housing_data.month == 10
        # assert housing_data.total_starts == 10
        # assert housing_data.total_complete == 5
        # assert housing_data.singles_starts == 3
        # assert housing_data.semis_starts == 2
        # assert housing_data.row_starts == 1
        # assert housing_data.apartment_starts == 4
        # assert housing_data.singles_complete == 1
        # assert housing_data.semis_complete == 1
        # assert housing_data.row_complete == 1
        # assert housing_data.apartment_complete == 2