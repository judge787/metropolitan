package com.metropolitan.backend.housing.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.metropolitan.backend.housing.dao.DataDao;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

public class DataStatisticsServiceTest {
    
    @Mock
    private DataDao dataDao;

    @InjectMocks
    private DataStatisticsService dataStatisticsService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCount() {
        Integer expectedCount = 5;
        when(dataDao.getCount()).thenReturn(expectedCount);

        Integer result = dataStatisticsService.count();

        assertEquals(expectedCount, result);
        verify(dataDao, times(1)).getCount();
    }

    @Test
    public void testGetTotalStartsByArea_Success() {
        String area = "TestArea";
        int expected = 10;
        when(dataDao.sumTotalStartsByCensusArea(area)).thenReturn(expected);

        int actual = dataStatisticsService.getTotalStartsByArea(area);
        assertEquals(expected, actual);
    }

    @Test
    public void testGetTotalCompleteByArea_Success() {
        String area = "TestArea";
        int expected = 10;
        when(dataDao.sumTotalCompleteByCensusArea(area)).thenReturn(expected);

        int actual = dataStatisticsService.getTotalCompleteByArea(area);
        assertEquals(expected, actual);
    }
}
