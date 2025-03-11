package com.metropolitan.backend.housing.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.metropolitan.backend.housing.dao.DataDao;
import com.metropolitan.backend.housing.models.Data;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;

public class DataQueryServiceTest {
    
    @Mock
    private DataDao dataDao;

    @InjectMocks
    private DataQueryService dataQueryService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testAllData() {
        List<Data> expectedData = new ArrayList<>();
        when(dataDao.findAll()).thenReturn(expectedData);

        Iterable<Data> result = dataQueryService.allData();

        assertEquals(expectedData, result);
        verify(dataDao).findAll();
    }

    @Test
    public void testGetDataByTotalStarts_Success() {
        Integer totalStarts = 1;
        List<Data> expectedData = new ArrayList<>();
        when(dataDao.getDataByTotalStarts(totalStarts)).thenReturn(expectedData);

        Iterable<Data> result = dataQueryService.getDataByTotalStarts(totalStarts);

        assertEquals(expectedData, result);
        verify(dataDao).getDataByTotalStarts(totalStarts);
    }

    @Test
    public void testGetDataByTotalComplete_Success() {
        Integer totalComplete = 1;
        List<Data> expectedData = new ArrayList<>();
        when(dataDao.getDataByTotalComplete(totalComplete)).thenReturn(expectedData);

        Iterable<Data> result = dataQueryService.getDataByTotalComplete(totalComplete);

        assertEquals(expectedData, result);
        verify(dataDao).getDataByTotalComplete(totalComplete);
    }
}
