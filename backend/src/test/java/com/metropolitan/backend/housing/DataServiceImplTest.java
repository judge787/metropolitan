package com.metropolitan.backend.housing;

import com.metropolitan.backend.exceptions.NotFoundException;
import com.metropolitan.backend.housing.dao.DataDao;
import com.metropolitan.backend.housing.models.Data;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class DataServiceImplTest {
    @Mock
    private DataDao dataDao;

    @InjectMocks
    private DataServiceImpl dataService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetData_Success() {
        Data expectedData = new Data();
        when(dataDao.findById(1)).thenReturn(Optional.of(expectedData));

        Data result = dataService.getData(1);

        assertNotNull(result);
        assertEquals(expectedData, result);
        verify(dataDao).findById(1);
    }

    @Test
    void testGetData_NotFound() {
        when(dataDao.findById(1)).thenReturn(Optional.empty());

        NotFoundException exception = assertThrows(NotFoundException.class, () -> {
            dataService.getData(1);
        });

        assertEquals("Data not found", exception.getMessage());
        verify(dataDao).findById(1);
    }


    @Test
    void testAllData() {
        List<Data> expectedData = new ArrayList<>();
        when(dataDao.findAll()).thenReturn(expectedData);

        Iterable<Data> result = dataService.allData();

        assertEquals(expectedData, result);
        verify(dataDao).findAll();
    }


    @Test
    void testGetTotalStartsByArea_Success() {
        String area = "TestArea";
        int expected = 10;
        when(dataDao.sumTotalStartsByCensusArea(area)).thenReturn(expected);
        int actual = dataService.getTotalStartsByArea(area);
        assertEquals(expected, actual);
    }

    @Test
    void testGetTotalCompleteByArea_Success() {
        String area = "TestArea";
        int expected = 10;
        when(dataDao.sumTotalCompleteByCensusArea(area)).thenReturn(expected);
        int actual = dataService.getTotalCompleteByArea(area);
        assertEquals(expected, actual);
    }

    @Test
    void testGetTotalStartsByArea_NonExistentArea() {
        String area = "Nonexistent Area";

        when(dataDao.sumTotalStartsByCensusArea(area)).thenReturn(0);

        Integer actualTotalStarts = dataService.getTotalStartsByArea(area);

        assertEquals(0, actualTotalStarts);
    }

    @Test
    void testGetTotalCompleteByArea_NonExistentArea() {
        String area = "Nonexistent Area";

        when(dataDao.sumTotalCompleteByCensusArea(area)).thenReturn(0);

        Integer actualTotalComplete = dataService.getTotalCompleteByArea(area);

        assertEquals(0, actualTotalComplete);
    }

    @Test
    void testGetTotalStartsByArea_Failure() {
        String area = "TestArea";
        when(dataDao.sumTotalStartsByCensusArea(area)).thenThrow(new RuntimeException("Fetch failed"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            dataService.getTotalStartsByArea(area);
        });

        assertEquals("Fetch failed", exception.getMessage());
        verify(dataDao).sumTotalStartsByCensusArea(area);
    }

    @Test
    void testGetTotalCompleteByArea_Failure() {
        String area = "TestArea";
        when(dataDao.sumTotalCompleteByCensusArea(area)).thenThrow(new RuntimeException("Fetch failed"));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            dataService.getTotalCompleteByArea(area);
        });

        assertEquals("Fetch failed", exception.getMessage());
        verify(dataDao).sumTotalCompleteByCensusArea(area);
    }

    @Test
    void testAllData_EmptyList() {
        when(dataDao.findAll()).thenReturn(new ArrayList<>());
        Iterable<Data> result = dataService.allData();
        assertNotNull(result);
        assertFalse(result.iterator().hasNext());
        verify(dataDao).findAll();
    }
}
