package com.metropolitan.backend.combined.service;

import com.metropolitan.backend.combined.model.CombinedDTO;
import com.metropolitan.backend.housing.DataService;
import com.metropolitan.backend.housing.models.Data;
import com.metropolitan.backend.labour_market.LabourDataService;
import com.metropolitan.backend.labour_market.models.LabourData;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.*;

class CombinedDataServiceTest {

    @Mock
    private DataService housingDataService;

    @Mock
    private LabourDataService labourDataService;

    @InjectMocks
    private CombinedDataService combinedDataService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetCombinedData() {
        // Arrange
        String censusArea = "TestArea";
        Integer id = 123;
        Integer totalStarts = 500; // Mocked total starts

        LabourData mockLabourData = new LabourData();
        mockLabourData.setId(id);
        mockLabourData.setProvince(1); // Sample data

        when(housingDataService.getTotalStartsByArea(censusArea)).thenReturn(totalStarts);
        when(labourDataService.getDataById(id)).thenReturn(mockLabourData);

        // Act
        CombinedDTO result = combinedDataService.getHousingStartsWithLabourData(censusArea, id);

        // Assert
        assertNotNull(result);
        assertEquals(censusArea, result.getCensusArea());
        assertEquals(totalStarts, result.getTotalStarts());
        assertEquals(mockLabourData, result.getLabourData());

        verify(housingDataService, times(1)).getTotalStartsByArea(censusArea);
        verify(labourDataService, times(1)).getDataById(id);
    }
}
