import pytest
import requests
from unittest.mock import patch, MagicMock
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
            "Total_complete": 5
        }
    ]

def test_fetch_tasks_success(data_ingester, mock_api_response):
    mock_response = MagicMock()
    mock_response.json.return_value = mock_api_response
    mock_response.raise_for_status.return_value = None

    with patch('requests.get', return_value=mock_response) as mock_get:
        tasks = data_ingester.fetch_tasks()
        mock_get.assert_called_once_with(
            data_ingester.api_url,
            headers={"Apikey": data_ingester.api_key},
            timeout=10,
            verify = False
        )
        assert tasks == mock_api_response

def test_fetch_tasks_failure(data_ingester):
    with patch('requests.get', side_effect=requests.exceptions.RequestException("API request failed")) as mock_get:
        tasks = data_ingester.fetch_tasks()
        mock_get.assert_called_once_with(
            data_ingester.api_url,
            headers={"Apikey": data_ingester.api_key},
            timeout=10
        )
        assert tasks == []

def test_fetch_tasks_http_error(data_ingester):
    mock_response = MagicMock()
    mock_response.raise_for_status.side_effect = requests.exceptions.HTTPError("HTTP error")

    with patch('requests.get', return_value=mock_response) as mock_get:
        tasks = data_ingester.fetch_tasks()
        mock_get.assert_called_once_with(
            data_ingester.api_url,
            headers={"Apikey": data_ingester.api_key},
            timeout=10
        )
        assert tasks == []

def test_process_and_store_no_tasks(data_ingester):
    with patch.object(data_ingester, 'fetch_tasks', return_value=[]):
        with patch.object(data_ingester.db, 'insert_housing_data') as mock_db:
            data_ingester.process_and_store()
            mock_db.assert_not_called()
