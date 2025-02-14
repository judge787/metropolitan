package com.metropolitan.backend.housing;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.metropolitan.backend.exceptions.NotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.metropolitan.backend.housing.dao.DataDao;
import com.metropolitan.backend.housing.models.Data;

public class DataServiceImplTest {
    @Mock
    private DataDao dataDao;

    @InjectMocks
    private DataServiceImpl dataService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testAddData_Success() {
        Data newData = new Data();
        when(dataDao.save(newData)).thenReturn(newData);

        String result = dataService.addData(newData);

        assertEquals("Saved", result);
        verify(dataDao).save(newData);
    }

    @Test
    public void testAddData_Failure() {
        Data newData = new Data();
        when(dataDao.save(newData)).thenThrow(new RuntimeException("Save failed"));

        String result = dataService.addData(newData);
        
        assertEquals("Save failed", result);
        verify(dataDao).save(newData);
    }
    
    @Test
    public void testGetData_Success() {
        Data expectedData = new Data();
        when(dataDao.findById(1)).thenReturn(Optional.of(expectedData));

        Data result = dataService.getData(1);

        assertNotNull(result);
        assertEquals(expectedData, result);
        verify(dataDao).findById(1);
    }

    @Test
    public void testGetData_NotFound() {
        when(dataDao.findById(1)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            dataService.getData(1);
        });

        assertEquals("Data not found", exception.getMessage());
        verify(dataDao).findById(1);
    }

    @Test
    public void testUpdateData_Success() {
        Integer id = 1;
        Integer totalStarts = 10;
        Integer totalComplete = 20;        
        Data newData = new Data(id, "", totalStarts, totalComplete);
        when(dataDao.save(newData)).thenReturn(newData);

        String result = dataService.updateData(newData);

        assertEquals("Updated", result);
        verify(dataDao).save(newData);
    }

    @Test
    public void testUpdateData_Failure() {
        Integer id = 1;
        Integer totalStarts = 10;
        Integer totalComplete = 20;
        Data newData = new Data(id, "", totalStarts, totalComplete);
        when(dataDao.save(newData)).thenThrow(new RuntimeException("Save failed"));

        String result = dataService.addData(newData);

        assertEquals("Save failed", result);
        verify(dataDao).save(newData);
    }

    @Test
    public void testDeleteData_Success() {
        Integer id = 1;
        when(dataDao.existsById(id)).thenReturn(true);

        String result = dataService.deleteData(id);

        assertEquals("Deleted", result);

        verify(dataDao).deleteById(id);
    }

    @Test
    public void testDeleteData_NotFound() {
        Integer id = 1;
        when(dataDao.existsById(id)).thenReturn(false);

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            dataService.deleteData(id);
        });

        assertEquals("Data not found", exception.getMessage());

        verify(dataDao).existsById(id);
        verify(dataDao, never()).deleteById(id);
    }

    @Test
    public void testAllData() {
        List<Data> expectedData = new ArrayList<>();
        when(dataDao.findAll()).thenReturn(expectedData);

        Iterable<Data> result = dataService.allData();

        assertEquals(expectedData, result);
        verify(dataDao).findAll();
    }

    @Test
    public void testCount() {
        Integer expectedCount = 5;
        when(dataDao.getCount()).thenReturn(expectedCount);

        Integer result = dataService.count();

        assertEquals(expectedCount, result);
        verify(dataDao, times(1)).getCount();
    }

    @Test
    public void testGetDataByTotalStarts_Success() {
        Integer totalStarts = 1;
        List<Data> expectedData = new ArrayList<>();
        when(dataDao.getDataByTotalStarts(totalStarts)).thenReturn(expectedData);

        Iterable<Data> result = dataService.getDataByTotalStarts(totalStarts);

        assertEquals(expectedData, result);
        verify(dataDao).getDataByTotalStarts(totalStarts);
    }

    @Test
    public void testGetDataByTotalStarts_Failure() {
        Integer totalStarts = 1;
        when(dataDao.getDataByTotalStarts(totalStarts)).thenThrow(new RuntimeException("Fetch failed"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            dataService.getDataByTotalStarts(totalStarts);
        });

        assertEquals("Fetch failed", exception.getMessage());
        verify(dataDao).getDataByTotalStarts(totalStarts);
    }

    @Test
    public void testGetDataByTotalComplete_Success() {
        Integer totalComplete = 1;
        List<Data> expectedData = new ArrayList<>();
        when(dataDao.getDataByTotalComplete(totalComplete)).thenReturn(expectedData);

        Iterable<Data> result = dataService.getDataByTotalComplete(totalComplete);

        assertEquals(expectedData, result);
        verify(dataDao).getDataByTotalComplete(totalComplete);
    }

    @Test
    public void testGetDataByTotalComplete_Failure() {
        Integer totalComplete = 1;
        when(dataDao.getDataByTotalComplete(totalComplete)).thenThrow(new RuntimeException("Fetch failed"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            dataService.getDataByTotalComplete(totalComplete);
        });

        assertEquals("Fetch failed", exception.getMessage());
        verify(dataDao).getDataByTotalComplete(totalComplete);
    }
}
