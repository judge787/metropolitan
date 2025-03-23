package com.metropolitan.backend.labour_market;

import com.metropolitan.backend.exceptions.NotFoundException;
import com.metropolitan.backend.labour_market.dao.LabourDataDao;
import com.metropolitan.backend.labour_market.models.LabourData;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LabourDataServiceImplTest {

    @Mock
    private LabourDataDao labourDataDao;

    @InjectMocks
    private LabourDataServiceImpl labourDataService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testAllData() {
        List<LabourData> labourDataList = new ArrayList<>();
        labourDataList.add(new LabourData(1, 1, 1, 1));
        labourDataList.add(new LabourData(2, 2, 2, 2));

        when(labourDataDao.findAll()).thenReturn(labourDataList);

        Iterable<LabourData> result = labourDataService.allData();

        assertNotNull(result);
        assertTrue(result.iterator().hasNext());
        assertEquals(2, ((List<LabourData>) result).size());
        verify(labourDataDao, times(1)).findAll();
    }

    @Test
    void testGetDataById_Found() {
        LabourData labourData = new LabourData(1, 1, 1, 1);
        when(labourDataDao.findById(1)).thenReturn(Optional.of(labourData));

        LabourData result = labourDataService.getDataById(1);

        assertNotNull(result);
        assertEquals(1, result.getId());
        verify(labourDataDao, times(1)).findById(1);
    }

    @Test
    void testGetDataById_NotFound() {
        when(labourDataDao.findById(1)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> labourDataService.getDataById(1));
        verify(labourDataDao, times(1)).findById(1);
    }
}